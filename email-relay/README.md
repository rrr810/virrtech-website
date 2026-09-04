# VirrTech email relay (Resend) — setup guide

Your site is static (GitHub Pages), so it cannot hold a Resend API key. This
folder contains a tiny Cloudflare Worker that is the **only** place the key
lives. The site sends client details here; the Worker forwards them to Resend,
which delivers them to your company inbox — with your own domain (better
deliverability than FormSubmit, and full control).

## 1. Resend account (2 minutes)

1. Sign up at https://resend.com
2. Dashboard → **Domains** → **Add Domain** → `virrtechsolutions.co.ke`
3. Resend shows 3 DNS records: **SPF**, **DKIM**, and **DMARC** TXT records.
4. Log in to your **HostPinnacle** cPanel → **Zone Editor / DNS** for
   virrtechsolutions.co.ke → add those TXT records exactly as shown.
5. Back in Resend, press **Verify** (takes a few minutes once DNS propagates).
6. **API Keys** → create key with **Sending access**. Copy it (shown once).

## 2. Deploy the Worker (~5 minutes, free tier)

From this folder:

```bash
npx wrangler login          # opens Cloudflare login in your browser
npx wrangler deploy         # prints a workers.dev URL
npx wrangler secret put RESEND_API_KEY   # paste the Resend key
npx wrangler secret put FROM_EMAIL       # e.g. "VirrTech Solutions <no-reply@virrtechsolutions.co.ke>"
```

Note the URL, e.g. `https://virrtech-mail-relay.<you>.workers.dev`.

## 3. Point the site at it

In `../js/config.js`:

```js
resendRelayUrl: 'https://virrtech-mail-relay.<you>.workers.dev',  // ← your worker URL
notifyTo: 'info@virrtechsolutions.co.ke',   // ← where lead emails go (leave '' to use email field)
```

Commit + push. Done — paid leads and receipts now flow:
- **Owner:** full lead + receipt email to `notifyTo` (company inbox)
- **Customer:** a copy of the styled VirrTech receipt to their email
- Fallback: if `resendRelayUrl` is empty, the old FormSubmit path is used, so
  nothing breaks before the relay goes live.

## Test

```bash
curl -X POST https://virrtech-mail-relay.<you>.workers.dev \
  -H 'Content-Type: application/json' \
  -d '{"to":"you@example.com","subject":"VirrTech relay test","html":"<p>It works ✅</p>"}'
```

> Note: like any public form endpoint, it can be spammed; at your volumes this
> is fine. A Cloudflare rate-limit rule can be added later if ever needed.
