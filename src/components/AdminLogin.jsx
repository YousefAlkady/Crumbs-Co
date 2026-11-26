import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

/** Admin-only sign-in shown on /admin. Non-admin accounts are signed straight back out.
 *  The database enforces admin rights too (RLS); this only decides what the page shows. */
export default function AdminLogin({ onSignedIn, notAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(notAdmin ? 'This portal is for the bakery admin only.' : '');

  async function signIn(e) {
    e.preventDefault();
    setBusy(true); setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    onSignedIn();
  }

  async function forgot() {
    if (!email.includes('@')) return setMsg('Type your email first, then tap "Forgot password?".');
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    setMsg(error ? error.message : `If ${email} has an account, a reset link is on its way.`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cocoa px-5 py-16">
      <Head><title>Admin log in - Crumb & Co.</title></Head>
      <form onSubmit={signIn} className="w-full max-w-sm rounded-[32px] bg-cream p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/instagram/logo-badge.jpg" alt="" width={44} height={44} className="rounded-full" />
          <div>
            <p className="script text-2xl leading-none text-pink">Crumb &amp; Co.</p>
            <p className="kicker mt-1 text-[10px]">Admin portal</p>
          </div>
        </div>
        <h1 className="disp mb-6 text-4xl">Admin log in</h1>
        <div className="flex flex-col gap-3">
          <input type="email" autoComplete="username" placeholder="Admin email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-sticker" />
          <input type="password" autoComplete="current-password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-sticker" />
          {msg && <p className="rounded-xl bg-blush p-3 text-sm font-semibold" role="alert">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-pill solid mt-1 w-full">{busy ? 'Please wait…' : 'Log in'}</button>
          <button type="button" onClick={forgot} disabled={busy} className="text-sm font-semibold text-pink-deep underline">Forgot password?</button>
        </div>
        <Link href="/" className="mt-6 block text-center text-sm text-cocoa/60 hover:text-cocoa">← Back to the shop</Link>
      </form>
    </div>
  );
}
