# SANJAGH SECURITY BASELINE

## Scope
This document defines the minimum security rules for the Sanjagh V2 prototype while the project is migrated to a production architecture.

## Supabase key rules
- Browser code may use only a Supabase Publishable key.
- A `service_role` or secret key must never appear in HTML, JavaScript delivered to browsers, CSS, images, or other public assets.
- Server-side secrets belong only in a trusted backend or Supabase Edge Function environment.
- The current repository previously contained a JWT identified in code as `SUPABASE_ANON_KEY` whose role was `service_role`. That credential must be revoked/rotated in the Supabase project before production use.

## Database rules
- Enable Row Level Security (RLS) on all application tables before exposing them through the browser.
- Create least-privilege policies for anonymous/public and authenticated operations.
- Do not rely on hiding a key in frontend code as a security boundary.
- File uploads must be protected by Storage policies and validated for type and size.

## Application rules
- Validate all user input both client-side and server-side.
- Escape/safely render user-controlled text; never inject untrusted values into HTML with raw `innerHTML` templates.
- Do not expose private contact information or internal notes unnecessarily.
- Avoid logging credentials, tokens, private documents, or personal data.

## Deployment checklist
1. Revoke the legacy exposed `service_role` credential in Supabase.
2. Create/use a Publishable key for the browser client.
3. Configure RLS and Storage policies.
4. Keep secret keys only in backend/Edge Function environment variables.
5. Verify no secrets are present in the repository or build output.
6. Add automated secret scanning before production release.
