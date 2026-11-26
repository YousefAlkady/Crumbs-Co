import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { RefreshCw, LogOut, Search, Phone, MapPin, Check, X, Clock, Cookie, Eye, EyeOff, Mail, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { checkIsAdmin } from '../lib/admin';
import AdminLogin from '../components/AdminLogin';
import CookieEditor from '../components/CookieEditor';

const MAX_FAVORITES = 3; // home page "crowd favorites" on the live site

const norm = (s) => (s || '').toLowerCase(); // orders may store 'Pending' or 'pending'

// statuses used by the live database (same as the crumbsandco admin): pending -> completed | canceled
const TABS = [
  { id: 'pending', label: 'Pending', Icon: Clock },
  { id: 'completed', label: 'Completed', Icon: Check },
  { id: 'products', label: 'Cookies', Icon: Cookie },
];

function Toggle({ on, onChange, label, busy }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={busy} onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${on ? 'bg-mint-dark' : 'bg-cocoa/25'}`}>
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[left] ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [access, setAccess] = useState('checking'); // checking | login | not-admin | admin
  const [busy, setBusy] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | cookie row

  // signed-in admins see the dashboard; anyone else gets the admin-only log in (non-admins are signed out)
  async function checkAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setAccess('login');
    if (await checkIsAdmin(user.email)) { setAccess('admin'); fetchData(); return; }
    await supabase.auth.signOut();
    setAccess('not-admin');
  }
  useEffect(() => { checkAccess(); }, []);

  // "Clear completed" only hides orders on this device (localStorage); nothing is deleted from the database
  const [hidden, setHidden] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => { try { setHidden(JSON.parse(localStorage.getItem('admin-hidden-orders') || '[]')); } catch {} }, []);

  // "Accepted" is a step on this device only: the DB keeps 'pending' (the live admin only knows pending/completed/canceled)
  const [accepted, setAccepted] = useState([]);
  useEffect(() => { try { setAccepted(JSON.parse(localStorage.getItem('admin-accepted-orders') || '[]')); } catch {} }, []);
  function accept(order) {
    const next = [...new Set([...accepted, order.id])];
    localStorage.setItem('admin-accepted-orders', JSON.stringify(next));
    setAccepted(next);
  }
  useEffect(() => { if (!confirmClear) return; const t = setTimeout(() => setConfirmClear(false), 4000); return () => clearTimeout(t); }, [confirmClear]);
  function clearCompleted() {
    if (!confirmClear) return setConfirmClear(true); // first tap arms it, second tap clears
    const next = [...new Set([...hidden, ...byStatus('completed').map((o) => o.id)])];
    localStorage.setItem('admin-hidden-orders', JSON.stringify(next));
    setHidden(next);
    setConfirmClear(false);
  }

  async function fetchData() {
    setLoading(true);
    const { data: orderData, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (orderData) setOrders(orderData);
    if (error) console.error('Fetch Error:', error.message);
    const { data: prodData } = await supabase.from('cookies').select('*').order('name');
    if (prodData) setProducts(prodData);
    setLoading(false);
  }

  async function setStatus(order, status) {
    if (status === 'canceled' && !confirm(`Cancel order ${order.order_number || ''} for ${order.customer_name}?`)) return;
    setBusy(`o${order.id}`);
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id);
    setBusy(null);
    if (!error) fetchData();
    else alert(error.message);
  }

  // stock / menu visibility only (cookies.in_stock, cookies.is_hidden); prices are not editable here
  async function setFlag(product, field, value) {
    setBusy(`p${product.id}${field}`);
    const { error } = await supabase.from('cookies').update({ [field]: value }).eq('id', product.id);
    setBusy(null);
    if (error) return alert(error.message);
    setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, [field]: value } : p)));
  }

  async function deleteCookie(c) {
    if (!confirm(`Delete "${c.name}" from the menu? This can't be undone.`)) return;
    setBusy(`d${c.id}`);
    const { error } = await supabase.from('cookies').delete().eq('id', c.id);
    setBusy(null);
    if (error) return alert(error.message);
    setProducts((ps) => ps.filter((p) => p.id !== c.id));
  }

  function toggleFavorite(c) {
    if (!c.is_favorite && products.filter((p) => p.is_favorite).length >= MAX_FAVORITES) {
      return alert(`Up to ${MAX_FAVORITES} crowd favorites. Un-star one first.`);
    }
    setFlag(c, 'is_favorite', !c.is_favorite);
  }

  async function logout() {
    await supabase.auth.signOut();
    setAccess('login');
  }

  const byStatus = (st) => orders.filter((o) => norm(o.status) === st && !hidden.includes(o.id));
  const q = searchTerm.trim().toLowerCase();
  const matches = (o) => !q || norm(o.order_number).includes(q) || norm(o.customer_name).includes(q) || norm(o.customer_phone).includes(q) || norm(o.customer_email).includes(q);
  const filteredOrders = activeTab === 'products' ? [] : byStatus(activeTab).filter(matches);
  const counts = { pending: byStatus('pending').length, completed: byStatus('completed').length, products: products.length };

  if (access === 'checking') {
    return <div className="flex min-h-screen items-center justify-center"><p className="kicker">Checking access…</p></div>;
  }
  if (access !== 'admin') return <AdminLogin notAdmin={access === 'not-admin'} onSignedIn={checkAccess} />;

  return (
    <div className="min-h-screen bg-cream">
      <Head><title>Admin - Crumb & Co.</title></Head>

      <header className="sticky top-0 z-30 border-b border-cocoa/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/instagram/logo-badge.jpg" alt="" width={36} height={36} className="rounded-full" />
            <span className="script text-2xl text-pink">Crumb &amp; Co.</span>
            <span className="kicker ml-1 rounded-full bg-cocoa px-2.5 py-1 text-[10px] text-cream">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold hover:bg-blush" aria-label="Refresh">
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={logout} className="flex items-center gap-2 rounded-full bg-cocoa px-4 py-2 font-semibold text-cream hover:bg-pink-deep">
              <LogOut className="size-4" /><span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <h1 className="disp text-[clamp(44px,7vw,88px)]">Dashboard</h1>

        {/* stat tiles double as tabs */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} aria-pressed={activeTab === id}
              className={`flex items-center justify-between rounded-[24px] p-6 text-left transition-colors ${activeTab === id ? 'bg-cocoa text-cream' : 'bg-white hover:bg-blush shadow-[inset_0_0_0_1px_rgba(74,30,27,.1)]'}`}>
              <div>
                <p className="kicker opacity-80">{label}</p>
                <p className="disp mt-2 text-5xl">{loading ? '–' : counts[id]}</p>
              </div>
              <Icon className="size-8 opacity-70" />
            </button>
          ))}
        </div>

        {activeTab !== 'products' && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
          <label className="relative block min-w-[240px] flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cocoa/50" />
            <input type="text" placeholder="Search by order number, name, phone or email…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className="input-sticker pl-12" />
          </label>
          {activeTab === 'completed' && counts.completed > 0 && (
            <button onClick={clearCompleted} aria-live="polite"
              className={`btn-pill ${confirmClear ? 'solid !bg-pink-deep !border-pink-deep' : 'ghost'}`}>
              <Trash2 className="size-4" /> {confirmClear ? `Tap again to clear ${counts.completed}` : 'Clear completed'}
            </button>
          )}
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-64 animate-pulse rounded-[24px] bg-blush/60" />)}</div>
          ) : activeTab === 'products' ? (
            <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-cocoa/70">Star up to {MAX_FAVORITES} crowd favorites. Prices change only here.</p>
              <button onClick={() => setEditing('new')} className="btn-pill solid"><Plus className="size-5" /> Add cookie</button>
            </div>
            <ul className="divide-y divide-cocoa/10 overflow-hidden rounded-[24px] bg-white shadow-[inset_0_0_0_1px_rgba(74,30,27,.1)]">
              {products.length === 0 && <li className="p-6">No cookies yet. Add the first one.</li>}
              {products.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 md:p-5">
                  {(p.image_url || p.images?.[0]) ? <img src={p.image_url || p.images[0]} alt="" className="size-16 rounded-2xl bg-blush object-cover" /> : <span className="flex size-16 items-center justify-center rounded-2xl bg-blush text-2xl" aria-hidden>🍪</span>}
                  <div className="min-w-[160px] flex-1">
                    <p className="flex items-center gap-1.5 text-lg font-semibold leading-tight">{p.name}{p.is_favorite && <Star className="size-4 text-pink" fill="currentColor" aria-label="Crowd favorite" />}</p>
                    <p className="text-sm text-cocoa/70">{p.price} L.E.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      In stock <Toggle on={p.in_stock !== false} label={`${p.name} in stock`} busy={busy === `p${p.id}in_stock`} onChange={(v) => setFlag(p, 'in_stock', v)} />
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {!p.is_hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />} On menu
                      <Toggle on={!p.is_hidden} label={`${p.name} shown on menu`} busy={busy === `p${p.id}is_hidden`} onChange={(v) => setFlag(p, 'is_hidden', !v)} />
                    </span>
                    <span className="flex items-center gap-1">
                      <button onClick={() => toggleFavorite(p)} disabled={busy === `p${p.id}is_favorite`} aria-label={p.is_favorite ? `Remove ${p.name} from favorites` : `Make ${p.name} a favorite`}
                        className={`rounded-full p-2 hover:bg-blush ${p.is_favorite ? 'text-pink' : ''}`}><Star className="size-5" fill={p.is_favorite ? 'currentColor' : 'none'} /></button>
                      <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="rounded-full p-2 hover:bg-blush"><Pencil className="size-5" /></button>
                      <button onClick={() => deleteCookie(p)} disabled={busy === `d${p.id}`} aria-label={`Delete ${p.name}`} className="rounded-full p-2 hover:bg-pink-deep hover:text-cream"><Trash2 className="size-5" /></button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            </>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.length === 0 && <p className="col-span-full rounded-[24px] bg-white p-8 text-center">No orders here.</p>}
              {filteredOrders.map((order) => {
                const items = order.items || [];
                return (
                  <article key={order.id} className="flex flex-col rounded-[24px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(74,30,27,.1)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="kicker text-pink-deep">{order.order_number || 'Order'}</p>
                        <h3 className="disp mt-1 text-2xl">{order.customer_name}</h3>
                      </div>
                      <span className={`kicker shrink-0 rounded-full px-2.5 py-1 text-[10px] ${norm(order.status) === 'pending' ? 'bg-blush text-pink-deep' : 'bg-mint text-mint-dark'}`}>
                        {norm(order.status) !== 'pending' ? 'Completed' : accepted.includes(order.id) ? 'Accepted' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-cocoa/60">{new Date(order.created_at).toLocaleString()}</p>
                    <a href={`tel:${order.customer_phone}`} className="mt-4 flex items-center gap-2 font-semibold hover:text-pink-deep"><Phone className="size-4" /> {order.customer_phone}</a>
                    {order.customer_email && <a href={`mailto:${order.customer_email}`} className="mt-1 flex items-center gap-2 text-sm hover:text-pink-deep"><Mail className="size-4" /> {order.customer_email}</a>}
                    <p className="mt-2 flex gap-2 rounded-2xl bg-cream p-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0" /> {order.customer_address}</p>
                    <ul className="mt-4 space-y-1 text-sm">
                      {items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-3"><span>{item.name}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</span><span className="text-cocoa/70">{item.price * (item.quantity || 1)} L.E.</span></li>
                      ))}
                    </ul>
                    {order.additional_notes && <p className="mt-3 rounded-2xl bg-blush/60 p-3 text-sm">📝 {order.additional_notes}</p>}
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="disp text-2xl">{order.total_amount} L.E.</span>
                      {norm(order.status) === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => setStatus(order, 'canceled')} disabled={busy === `o${order.id}`} aria-label="Cancel order"
                            className="flex size-10 items-center justify-center rounded-full bg-cream hover:bg-pink-deep hover:text-cream disabled:opacity-50"><X className="size-4" /></button>
                          {accepted.includes(order.id) ? (
                            <button onClick={() => setStatus(order, 'completed')} disabled={busy === `o${order.id}`}
                              className="flex items-center gap-2 rounded-full bg-mint-dark px-4 py-2.5 text-sm font-semibold text-cream hover:bg-cocoa disabled:opacity-50">
                              <Check className="size-4" /> Complete order
                            </button>
                          ) : (
                            <button onClick={() => accept(order)}
                              className="flex items-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-sm font-semibold text-cream hover:bg-pink-deep">
                              <Check className="size-4" /> Accept order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {editing && <CookieEditor cookie={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />}
    </div>
  );
}
