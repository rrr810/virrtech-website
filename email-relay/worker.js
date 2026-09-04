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
export default {
  async fetch(request, env) {
    // Only allow POST from the site
    if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });

    const origin = request.headers.get('origin') || '';
    const allow =
      origin.endsWith('virrtechsolutions.co.ke') ||
      origin.endsWith('rrr810.github.io') ||
      origin === 'null';

    let body;
    try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad json' }, 400, origin); }

    // Minimal sanity checks
    if (!body.to || typeof body.to !== 'string' || body.to.length > 320 || !body.to.includes('@')) {
      return json({ ok: false, error: 'missing or invalid to' }, 400, origin, allow);
    }
    if (!body.subject || body.subject.length > 200) return json({ ok: false, error: 'missing subject' }, 400, origin, allow);
    if (!body.html && !body.text) return json({ ok: false, error: 'nothing to send' }, 400, origin, allow);
    if (!env.RESEND_API_KEY) return json({ ok: false, error: 'relay not configured' }, 500, origin, allow);

    const from = env.FROM_EMAIL || 'VirrTech Solutions <no-reply@virrtechsolutions.co.ke>';

    const payload = {
      from,
      to: body.to,
      subject: body.subject,
      reply_to: body.replyTo && body.replyTo.includes('@') ? body.replyTo : undefined,
    };
    if (body.html) payload.html = body.html;
    if (body.text) payload.text = body.text;

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
      if (!r.ok) return json({ ok: false, error: 'resend: ' + (data.message || r.status) }, 502, origin, allow);
      return json({ ok: true, id: data.id }, 200, origin, allow);
    } catch (e) {
      return json({ ok: false, error: 'relay error' }, 502, origin, allow);
    }
  },
};

function json(obj, status, origin, allow) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allow === false ? 'none' : (origin || '*'),
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
