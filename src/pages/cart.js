import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { readCart, writeCart } from '../lib/cart';

// same delivery area as the live checkout
const governorates = ["6th of October City", "Sheikh Zayed City"];

const countryCodes = [
  { code: "+20", name: "Egypt", flag: "🇪🇬" }, { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+971", name: "UAE", flag: "🇦🇪" }, { code: "+966", name: "KSA", flag: "🇸🇦" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" }, { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+33", name: "France", flag: "🇫🇷" }, { code: "+49", name: "Germany", flag: "🇩🇪" },
];

// shown only; the database prices every order itself (supabase/migrations/20261126_price_orders.sql)
const DELIVERY_FEE = 50;
const inputSticker = "input-sticker mb-4";
const labelClass = "font-fredoka font-semibold text-chocolate";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0].code);
  const [trashHover, setTrashHover] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [tempContact, setTempContact] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    setCart(readCart());
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setTempContact(user.email || '');
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data && data.address) {
          setProfile(data);
          setUseSavedAddress(true);
          setIsPhoneVerified(true);
        }
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!useSavedAddress) setIsPhoneVerified(false);
    else setIsPhoneVerified(true);
  }, [useSavedAddress]);

  function removeFromCart(index) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    writeCart(newCart);
  }

  async function deleteAddress(e) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete your saved address?")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    if (!error) {
      setProfile(null);
      setUseSavedAddress(false);
      alert("Address deleted.");
    }
  }

  async function handleVerifyClick(e) {
    e.preventDefault();
    const emailToSendTo = user ? user.email : tempContact;
    if (!emailToSendTo || !emailToSendTo.includes('@')) { alert("Please enter a valid email first."); return; }
    if (!tempPhone) { alert("Please enter a phone number first."); return; }
    setLoadingOtp(true);
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockCode);
    try {
      const res = await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailToSendTo, otpCode: mockCode }) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.skipped) setIsPhoneVerified(true); // email codes not set up on this server
      else if (res.ok) setShowOtpModal(true);
      else alert("Failed to send email.");
    } catch (err) { alert("Error sending email."); }
    setLoadingOtp(false);
  }

  function confirmOtp() {
    if (otpCode !== generatedOtp) { alert("Invalid code!"); return; }
    setIsPhoneVerified(true);
    setShowOtpModal(false);
    setOtpCode('');
  }

  async function submitOrder(e) {
    e.preventDefault();
    const form = e.target;
    if (!isPhoneVerified) { alert("Please verify your phone first."); return; }
    if (cart.length < 2) { alert("Minimum order is a box of 2 cookies."); return; }
    const finalEmail = user ? user.email : form.contact.value;
    const data = {
      contact: finalEmail,
      deliveryMethod: form.deliveryMethod.value,
      firstName: useSavedAddress && profile ? profile.first_name : form.firstName.value,
      lastName: useSavedAddress && profile ? profile.last_name : form.lastName.value,
      addressLine: useSavedAddress && profile ? profile.address : form.address.value,
      apartment: useSavedAddress && profile ? profile.apartment : form.apartment.value,
      governorate: useSavedAddress && profile ? profile.governorate : form.governorate.value,
      postalCode: useSavedAddress && profile ? "" : form.postalCode.value,
      rawPhone: useSavedAddress && profile ? profile.phone : form.phone.value,
    };
    data.fullPhone = useSavedAddress ? profile.phone : `${selectedCountry} ${data.rawPhone}`;
    const fullName = `${data.firstName} ${data.lastName}`;
    const fullAddressString = `[${data.deliveryMethod}] ${data.addressLine}, Apt: ${data.apartment}, ${data.governorate}${data.postalCode ? `. Postal: ${data.postalCode}` : ''}. Contact: ${data.contact}`;
    const orderCode = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    // live orders table stores one line per cookie with a quantity (same shape as the crumbsandco site)
    const items = Object.values(cart.reduce((g, it) => {
      const k = it.id ?? it.name;
      g[k] = g[k] ? { ...g[k], quantity: g[k].quantity + 1 } : { id: it.id, name: it.name, price: it.price, quantity: 1, image: it.image_url || undefined };
      return g;
    }, {}));

    // no .select() after insert: customers may create orders but not read them back (RLS)
    const { error } = await supabase.from('orders').insert({
      order_number: orderCode, customer_name: fullName, customer_email: finalEmail, customer_phone: data.fullPhone,
      customer_address: fullAddressString, total_amount: total, items, status: 'pending',
      additional_notes: form.notes.value.trim() || null,
    });

    if (!error) {
      try {
        await fetch('/api/send-receipt', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode, customerName: fullName, customerEmail: finalEmail, cart, total, address: fullAddressString, deliveryMethod: data.deliveryMethod })
        });
      } catch (err) { console.error(err); }
      writeCart([]);
      setCart([]);
      setOrderSuccess({ code: orderCode, email: finalEmail, phone: data.fullPhone });
    } else {
      alert('Error placing order: ' + error.message);
    }
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-cream font-fredoka text-chocolate flex flex-col items-center justify-center p-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl border-4 border-chocolate shadow-sticker max-w-md"
        >
          <h1 className="font-chewy text-4xl text-mint-dark mb-2">Order Confirmed!</h1>
          <p className="font-fredoka">Thank you for shopping with Crumb & Co.</p>
          <div className="bg-cream p-5 rounded-2xl border-4 border-dashed border-chocolate my-8">
            <p className="text-sm text-chocolate/70 mb-1">ORDER NUMBER</p>
            <h2 className="font-chewy text-3xl m-0">{orderSuccess.code}</h2>
          </div>
          <p className="font-fredoka mb-6">Confirmation sent to <strong>{orderSuccess.email}</strong></p>
          <Link href="/">
            <motion.button
              whileTap={{ x: 4, y: 4 }}
              className="bg-chocolate text-white border-4 border-chocolate px-8 py-4 rounded-full font-fredoka font-semibold text-lg shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed cursor-pointer transition-all"
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-fredoka text-chocolate">
      <Head><title>Checkout - Crumb & Co.</title></Head>

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 md:py-16 flex flex-col-reverse lg:flex-row gap-10 lg:gap-14 justify-center">
        <div className="flex-1 min-w-[300px] max-w-[600px]">
          <h2 className="font-chewy text-3xl mb-6">Contact</h2>
          <form id="checkoutForm" onSubmit={submitOrder}>
            <input
              name="contact" type="email" required placeholder="Email for receipt"
              readOnly={!!user} value={user ? user.email : tempContact} onChange={(e) => setTempContact(e.target.value)}
              className={`${inputSticker} ${user ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            />

            <h3 className={`${labelClass} text-lg mt-6 mb-3`}>Delivery</h3>
            <input type="hidden" name="deliveryMethod" value="Ship" />
            <div className="rounded-2xl bg-white p-4 mb-6 flex items-center gap-3 shadow-[inset_0_0_0_2px_rgba(74,30,27,.15)]">
              <span className="size-4 rounded-full bg-cocoa" />
              <span className="font-semibold">Delivery to your door · {DELIVERY_FEE} L.E.</span>
            </div>

            <h3 className={`${labelClass} text-lg mb-3`}>Shipping Address</h3>

            {profile && (
              <div className="flex flex-col gap-4 mb-6">
                <motion.div
                  onClick={() => setUseSavedAddress(true)}
                  whileHover={{ scale: 1.01 }}
                  className={`flex gap-4 items-start justify-between p-5 rounded-2xl border-4 cursor-pointer transition-all
                    ${useSavedAddress ? 'border-pastel-hotpink bg-pastel-pink/30 shadow-sticker' : 'border-chocolate bg-white'}`}
                >
                  <div className="flex gap-4 items-start">
                    <input type="radio" checked={useSavedAddress} onChange={() => setUseSavedAddress(true)} className="mt-1 accent-pastel-hotpink scale-125" />
                    <div>
                      <strong className="text-lg font-fredoka">Use Saved Address</strong>
                      <div className="mt-2 text-chocolate/80 font-fredoka leading-relaxed">
                        <div><strong>{profile.first_name} {profile.last_name}</strong></div>
                        <div>{profile.address}, Apt {profile.apartment}</div>
                        <div>{profile.governorate}, Egypt</div>
                        <div>{profile.phone}</div>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={deleteAddress} onMouseEnter={() => setTrashHover(true)} onMouseLeave={() => setTrashHover(false)}
                    className={`p-2 border-none cursor-pointer transition-colors ${trashHover ? 'text-red-500' : 'text-chocolate'}`} title="Delete saved address">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </motion.div>
                <div onClick={() => setUseSavedAddress(false)} className={`flex gap-3 items-center cursor-pointer ${useSavedAddress ? 'opacity-60' : ''}`}>
                  <input type="radio" checked={!useSavedAddress} onChange={() => setUseSavedAddress(false)} className="accent-pastel-hotpink scale-125" />
                  <span className="font-fredoka font-semibold">Add a New Address</span>
                </div>
              </div>
            )}

            {(!useSavedAddress || !profile) && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <select className={inputSticker} defaultValue="Egypt"><option value="Egypt">Egypt</option></select>
                <div className="flex gap-4">
                  <input name="firstName" placeholder="First name" required className={inputSticker} />
                  <input name="lastName" placeholder="Last name" required className={inputSticker} />
                </div>
                <input name="address" placeholder="Address" required className={inputSticker} />
                <input name="apartment" placeholder="Apartment, suite (optional)" className={inputSticker} />
                <select name="governorate" className={inputSticker} defaultValue="6th of October City">
                  {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input name="postalCode" placeholder="Postal code (optional)" className={inputSticker} />
                <div className="mb-6">
                  <div className="flex gap-4">
                    <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className={`${inputSticker} w-32 mb-0`}>
                      {countryCodes.map((c, i) => <option key={i} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input name="phone" placeholder="Phone" required value={tempPhone} onChange={(e) => { setTempPhone(e.target.value); setIsPhoneVerified(false); }}
                      className={`${inputSticker} flex-1 mb-0 ${isPhoneVerified ? '!border-mint-dark' : ''}`} />
                  </div>
                  <div className="text-right mt-2">
                    {isPhoneVerified ? (
                      <span className="text-mint-dark font-fredoka font-bold text-sm">✓ Verified</span>
                    ) : (
                      <button type="button" onClick={handleVerifyClick} disabled={loadingOtp}
                        className="border-none bg-transparent text-pastel-hotpink underline cursor-pointer text-sm font-bold font-fredoka">
                        {loadingOtp ? 'Sending...' : 'Verify Phone via Email'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <h3 className={`${labelClass} text-lg mt-6 mb-3`}>Notes <span className="font-normal text-cocoa/60">(optional)</span></h3>
            <textarea name="notes" rows={3} maxLength={500} placeholder="Gate code, gift message, allergies…" className={`${inputSticker} resize-none`} />

            <h3 className={`${labelClass} text-lg mt-6 mb-3`}>Payment</h3>
            <div className="border-4 border-chocolate rounded-2xl bg-cream p-4 flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-chocolate" />
              <strong className="font-fredoka">Cash on Delivery (COD)</strong>
            </div>

            <motion.button type="submit" disabled={!isPhoneVerified || cart.length < 2}
              whileTap={isPhoneVerified ? { x: 4, y: 4 } : {}}
              className={`w-full mt-6 py-5 rounded-2xl border-4 border-chocolate font-fredoka font-semibold text-lg cursor-pointer transition-all
                ${isPhoneVerified && cart.length >= 2 ? 'bg-chocolate text-white shadow-sticker hover:shadow-sticker-hover' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {cart.length < 2 ? 'Add at least 2 cookies' : isPhoneVerified ? 'Complete Order' : 'Verify Phone to Continue'}
            </motion.button>
          </form>
        </div>

        <aside className="w-full lg:w-[380px] lg:sticky lg:top-28 self-start rounded-[28px] bg-blush p-6 md:p-8">
          <h2 className="disp text-4xl mb-6">Your box</h2>
          {cart.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg mb-5">Your box is empty.</p>
              <Link href="/order" className="btn-pill solid">Browse the menu</Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {Object.values(cart.reduce((g, item, i) => {
                  const k = item.id ?? item.name;
                  g[k] = g[k] ? { ...g[k], qty: g[k].qty + 1, last: i } : { item, qty: 1, last: i };
                  return g;
                }, {})).map(({ item, qty, last }) => (
                  <li key={item.id ?? item.name} className="flex items-center gap-4">
                    {item.image_url
                      ? <img src={item.image_url} alt="" className="size-16 rounded-2xl object-cover bg-cream" />
                      : <span className="size-16 rounded-2xl bg-cream flex items-center justify-center text-2xl" aria-hidden>🍪</span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight truncate">{item.name}</p>
                      <p className="text-sm text-cocoa/70">{qty} × {item.price} L.E.</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(last)} aria-label={`Remove one ${item.name}`}
                      className="size-9 rounded-full bg-cream font-bold hover:bg-cocoa hover:text-cream transition-colors">−</button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-cocoa/15 flex items-baseline justify-between text-sm">
                <span>Delivery</span><span>{DELIVERY_FEE} L.E.</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="kicker">Total</span>
                <span className="disp text-3xl">{total} L.E.</span>
              </div>
              {cart.length < 2 && <p className="mt-4 text-sm font-semibold text-pink-deep">Minimum order is a box of 2. Add one more cookie.</p>}
            </>
          )}
        </aside>

        {showOtpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl border-4 border-chocolate shadow-sticker w-[90%] max-w-md text-center">
              <h2 className="font-chewy text-2xl mb-2 text-chocolate">Enter Verification Code</h2>
              <p className="font-fredoka mb-4">We sent a code to your email.</p>
              <input type="text" placeholder="1234" maxLength={4} inputMode="numeric" autoComplete="one-time-code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                className="input-sticker text-2xl text-center w-40 mx-auto my-4" />
              <motion.button onClick={confirmOtp} whileTap={{ x: 4, y: 4 }} className="w-full bg-pastel-hotpink text-white border-4 border-chocolate py-4 rounded-2xl font-fredoka font-semibold shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed cursor-pointer transition-all">
                Verify
              </motion.button>
              <button onClick={() => setShowOtpModal(false)} className="mt-3 border-none bg-transparent underline cursor-pointer font-fredoka">Cancel</button>
            </motion.div>
          </div>
        )}
      </div>
      <style jsx global>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
