/*
 * Sanjagh public Supabase configuration.
 *
 * IMPORTANT:
 * - Only a Supabase Publishable key belongs here.
 * - NEVER put a service_role / secret key in this file.
 * - This file is intentionally committed because Publishable keys are
 *   designed for use in public clients; database security must be enforced
 *   with Supabase RLS policies.
 */
window.SANJAGH_SUPABASE = Object.freeze({
  url: "https://kpmlkzocinkbnlwiivlr.supabase.co",
  publishableKey: ""
});
