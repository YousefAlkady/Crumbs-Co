import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { checkIsAdmin } from '../lib/admin';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // "Forgot password": Supabase emails a one-time link; the link opens /reset-password, where a new password is set.
  // Nothing changes for existing accounts until their owner asks for a reset.
  async function handleResetRequest(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (error) alert(error.message);
    else setResetSent(true);
  }

  async function checkAdminAndRedirect() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/order');
      return;
    }
    const isAdmin = await checkIsAdmin(user.email);
    router.push(isAdmin ? '/admin' : '/order');
  }

  async function handleSocialLogin(provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/order` },
    });
    if (error) alert(error.message);
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/login` } });
      if (error) alert(error.message);
      else { alert('Check your email to confirm!'); setIsSignUp(false); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else await checkAdminAndRedirect();
    }
    setLoading(false);
  }

  const socialBtn = "flex items-center justify-center gap-3 w-full py-4 mb-4 bg-white border-4 border-chocolate rounded-2xl font-fredoka text-base text-chocolate font-semibold cursor-pointer shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed transition-all";

  return (
    <div className="min-h-screen bg-cream font-fredoka text-chocolate">
      <Head>
        <title>Log In - Crumb & Co.</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <nav className="flex justify-between items-center px-6 md:px-8 py-4 bg-white border-b-4 border-chocolate">
        <Link href="/" className="font-chewy text-2xl text-pastel-hotpink">Crumb & Co.</Link>
        <Link href="/">
          <motion.button
            whileTap={{ x: 4, y: 4 }}
            className="px-5 py-2.5 rounded-full font-fredoka font-semibold border-4 border-chocolate text-chocolate bg-transparent shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed cursor-pointer transition-all"
          >
            HOME
          </motion.button>
        </Link>
      </nav>

      <div className="max-w-md mx-auto py-16 md:py-20 px-6 text-center">
        <h1 className="font-chewy text-5xl mb-10">Log in</h1>

        {!showEmailForm ? (
          <motion.button
            onClick={() => setShowEmailForm(true)}
            whileTap={{ x: 4, y: 4 }}
            className={socialBtn}
          >
            <i className="fa-regular fa-envelope" /> Log in with Email
          </motion.button>
        ) : (
          <div className="mb-6 text-left">
            {forgot ? (
              <form onSubmit={handleResetRequest}>
                <h2 className="disp text-3xl mb-2">Reset password</h2>
                {resetSent ? (
                  <p className="rounded-2xl bg-blush p-4 mb-4" role="status">If <strong>{email}</strong> has an account, a reset link is on its way. Open it on this device to choose a new password.</p>
                ) : (
                  <>
                    <p className="text-cocoa/75 mb-4">Enter your email and we&apos;ll send you a link to set a new password.</p>
                    <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="input-sticker mb-4" />
                    <button type="submit" disabled={loading} className="btn-pill solid w-full">{loading ? 'Sending...' : 'Send reset link'}</button>
                  </>
                )}
                <button type="button" onClick={() => { setForgot(false); setResetSent(false); }} className="mt-3 underline text-cocoa/70">Back to log in</button>
              </form>
            ) : (
            <form onSubmit={handleEmailAuth}>
              <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="input-sticker mb-4" />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="input-sticker mb-4" />
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={!loading ? { x: 4, y: 4 } : {}}
                className={`w-full py-4 rounded-2xl border-4 border-chocolate font-fredoka font-semibold text-lg shadow-sticker cursor-pointer transition-all ${loading ? 'bg-gray-300 text-gray-500' : 'bg-chocolate text-white'}`}
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
              </motion.button>
              {!isSignUp && (
                <button type="button" onClick={() => setForgot(true)} className="mt-3 block w-full text-right text-sm font-semibold text-pink-deep underline">Forgot password?</button>
              )}
            </form>
            )}
            <button onClick={() => setShowEmailForm(false)} className="mt-3 border-none bg-transparent underline cursor-pointer text-chocolate/70 font-fredoka">Cancel</button>
          </div>
        )}

        <motion.button onClick={() => handleSocialLogin('facebook')} whileTap={{ x: 4, y: 4 }} className={socialBtn}>
          <i className="fa-brands fa-facebook text-[#1877F2]" /> Log in with Facebook
        </motion.button>
        <motion.button onClick={() => handleSocialLogin('google')} whileTap={{ x: 4, y: 4 }} className={socialBtn}>
          <i className="fa-brands fa-google text-[#DB4437]" /> Log in with Google
        </motion.button>

        <div className="mt-8 pt-6 border-t-4 border-dashed border-chocolate">
          <p className="font-fredoka">
            Don&apos;t have an account?{' '}
            <button onClick={() => { setShowEmailForm(true); setIsSignUp(true); }} className="border-none bg-transparent text-pastel-hotpink font-bold cursor-pointer underline">
              Join now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
