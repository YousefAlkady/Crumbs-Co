import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import OrderMenu from '../components/OrderMenu';

export default function OrderPage() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');

  function triggerNotification(message) {
    setNotification(message);
    setTimeout(() => setNotification(''), 2500);
  }

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(savedCart.length);

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    function onCartUpdate(e) {
      setCartCount(e.detail ?? 0);
      triggerNotification('Added to cart! 🍪');
    }
    window.addEventListener('cart-update', onCartUpdate);
    return () => window.removeEventListener('cart-update', onCartUpdate);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.reload();
  }

  return (
    <div className="min-h-screen bg-cream text-chocolate font-fredoka">
      <Head>
        <title>Order - Crumb & Co.</title>
      </Head>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: notification ? 20 : -100, opacity: notification ? 1 : 0 }}
        className="fixed left-1/2 -translate-x-1/2 z-[2000] bg-chocolate text-white px-8 py-3 rounded-full font-fredoka font-semibold shadow-sticker border-4 border-chocolate"
      >
        {notification}
      </motion.div>

      <Navbar activePage="order" cartCount={cartCount} user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="font-chewy text-5xl sm:text-6xl text-chocolate mb-2">
            THE MENU
          </h1>
          <p className="text-chocolate/80 font-fredoka text-lg">
            Minimum order is a box of 2
          </p>
        </motion.div>

        <OrderMenu />
      </main>
    </div>
  );
}
