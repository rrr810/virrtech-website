/* VirrTech Solutions — site config (fill in your real values)
   NOTE: the Supabase anon key is PUBLIC by design (safe in frontend).
   Never put your service_role key in any frontend file. */
window.VIRRTECH = {
  /* From Supabase Dashboard → Project Settings → API */
  supabaseUrl: 'https://bdpieyqefxyxifpjdfte.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkcGlleXFlZnh5eGlmcGpkZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjAxMDYsImV4cCI6MjEwNDA5NjEwNn0.AkIZqNiia4Obqa63Ts42qyiv_az8CS298FP8rsbC6Rw',

  /* Contact details — replace everywhere before launch */
  waNumber: '254740793959',   // WhatsApp, digits only, country code first
  phoneDisplay: '+254 740 793 959',
  email: 'virrtech@gmail.com',
  /* Resend relay (email-relay/ folder) — set resendRelayUrl to the worker URL
     once deployed; notifyTo = the inbox that gets client details (company email).
     Leave resendRelayUrl '' to keep using the old FormSubmit path. */
  resendRelayUrl: '',
  notifyTo: 'virrtech@gmail.com',  // ← your inbox for client details & receipts (change later if you create a @virrtechsolutions.co.ke mailbox)
  /* Paystack — public key only (safe for static sites). Fill to enable online payments. */
  paystackPublicKey: 'pk_live_ae04fba4c6a70e8260b76ddc7d829f90d8be2b35',
  consultFeeKES: 1,
  currency: 'KES',
  domain: 'virrtechsolutions.co.ke'
};
