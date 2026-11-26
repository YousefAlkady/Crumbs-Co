import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { checkIsAdmin } from '../lib/admin';

/** Opened from the reset email. Supabase verifies the link and signs the user in with a recovery session;
 *  only then can a new password be saved. Without a valid link the form is not shown. */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // checking | ready | invalid | saving | done
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (live && event === 'PASSWORD_RECOVERY') setStatus('ready');
    });
    // getSession waits until supabase-js has read the token from the link in the URL
    supabase.auth.getSession().then(({ data }) => {
      if (live) setStatus((s) => (s === 'checking' ? (data.session ? 'ready' : 'invalid') : s));
    });
    return () => { live = false; sub.subscription.unsubscribe(); };
  }, []);

  async function save(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setStatus('saving');
    const { data, error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setStatus('ready'); return; }
    setStatus('done');
    const isAdmin = await checkIsAdmin(data.user?.email);
    setTimeout(() => router.push(isAdmin ? '/admin' : '/order'), 1500);
  }

  return (
    <>
      <Head><title>Reset password - Crumb & Co.</title></Head>
      <div className="mx-auto max-w-md px-6 py-16 md:py-24">
        <h1 className="disp text-5xl mb-6">New password</h1>
        {status === 'checking' && <p>Checking your reset link…</p>}
        {status === 'invalid' && (
          <div className="rounded-2xl bg-blush p-5">
            <p className="mb-4">This reset link is invalid or has expired.</p>
            <Link href="/login" className="btn-pill solid">Request a new link</Link>
          </div>
        )}
        {(status === 'ready' || status === 'saving') && (
          <form onSubmit={save} className="flex flex-col gap-4">
            <input type="password" autoComplete="new-password" placeholder="New password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-sticker" />
            <input type="password" autoComplete="new-password" placeholder="Repeat new password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-sticker" />
            {error && <p className="text-sm font-semibold text-pink-deep" role="alert">{error}</p>}
            <button type="submit" disabled={status === 'saving'} className="btn-pill solid">{status === 'saving' ? 'Saving…' : 'Save new password'}</button>
          </form>
        )}
        {status === 'done' && <p className="rounded-2xl bg-mint p-5 font-semibold" role="status">Password updated. Taking you in…</p>}
      </div>
    </>
  );
}
