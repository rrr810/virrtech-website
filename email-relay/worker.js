/**
 * VirrTech email relay — sends site emails through Resend.
 *
 * A static GitHub Pages site cannot hold a Resend API key safely, so this
 * tiny Worker is the only place the key ever lives (server-side secret).
 *
 * POST JSON:
 *   { "to": "client@example.com",            // recipient
 *     "replyTo": "customer@example.com",     // optional (answers go there)
 *     "subject": "…",
 *     "html": "<p>…</p>",                    // optional
 *     "text": "…" }                          // optional
 *
 * From-address is fixed at deploy time via FROM_EMAIL secret.
 */

function allowed(origin) {
  return (
    origin === '' ||
    origin === 'null' ||
    origin.endsWith('virrtechsolutions.co.ke') ||
    origin.endsWith('rrr810.github.io')
  );
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      corsHeaders(origin)
    ),
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';

    // Browser preflight — MUST answer OPTIONS or browsers block the POST
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allowed(origin) ? origin : '') });
    }

    if (!allowed(origin)) {
      return json({ ok: false, error: 'origin not allowed' }, 403, origin);
    }

    if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, origin);

    let body;
    try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad json' }, 400, origin); }

    if (!body.to || typeof body.to !== 'string' || body.to.length > 320 || !body.to.includes('@')) {
      return json({ ok: false, error: 'missing or invalid to' }, 400, origin);
    }
    if (!body.subject || body.subject.length > 200) return json({ ok: false, error: 'missing subject' }, 400, origin);
    if (!body.html && !body.text) return json({ ok: false, error: 'nothing to send' }, 400, origin);
    if (!env.RESEND_API_KEY) return json({ ok: false, error: 'relay not configured' }, 500, origin);

    const from = env.FROM_EMAIL || 'VirrTech Solutions <no-reply@virrtechsolutions.co.ke>';

    const payload = {
      from,
      to: body.to,
      subject: body.subject,
      reply_to: body.replyTo && body.replyTo.includes('@') ? body.replyTo : undefined,
    };
    if (body.html) payload.html = body.html;
    if (body.text) payload.text = body.text;
    // optional attachments: [{ filename, content(base64), type }]
    if (Array.isArray(body.attachments) && body.attachments.length) {
      let total = 0;
      const atts = [];
      for (const a of body.attachments.slice(0, 6)) {
        if (!a || !a.filename || typeof a.content !== 'string') continue;
        const fn = String(a.filename).slice(0, 255);
        const clean = a.content.replace(/\s+/g, '');
        total += clean.length;
        if (clean.length < 100 || total > 6 * 1024 * 1024) continue; // min ~50B pdf, cap 6MB total
        atts.push({ filename: fn, content: clean });
      }
      if (atts.length) payload.attachments = atts;
    }

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) return json({ ok: false, error: 'resend: ' + (data.message || r.status) }, 502, origin);
      return json({ ok: true, id: data.id }, 200, origin);
    } catch (e) {
      return json({ ok: false, error: 'relay error' }, 502, origin);
    }
  },
};
