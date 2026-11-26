import { supabase } from './supabaseClient';

/**
 * True when the signed-in user is an admin (profiles.is_admin, via the public.is_admin() database function).
 * The database enforces the same check in its RLS policies; this only decides what the UI shows.
 * `email` is only used to skip the call when nobody is signed in.
 */
export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const { data, error } = await supabase.rpc('is_admin');
  if (error) {
    console.error('[admin] Error checking admin status:', error.message);
    return false;
  }
  return data === true;
}
