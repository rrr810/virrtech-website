# VirrTech Solutions — Website

Static marketing site (HTML/CSS/JS, no build step). Deploys as-is to Netlify.

- Pages: index · services (prices) · work · about · start (contact + lead form)
- Stack: vanilla HTML/CSS/JS · Supabase (inquiries) · Netlify (hosting)
- Design: "Midnight & Gold" identity (see ../VirrTech-Brand-System-Guide.html)

## Go live
1. Supabase: run `../supabase/schema.sql` in the SQL editor
2. Put Project URL + anon key in `js/config.js`
3. Push this folder to GitHub → import into Netlify (publish dir: `/`)
