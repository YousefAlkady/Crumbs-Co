import { useEffect, useRef, useState } from 'react';
import { X, ImagePlus, Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

/** Add or edit a cookie in a side panel on /admin (replaces the old separate add-cookie page).
 *  Photos upload to the `cookie-images` bucket like the live site; the first photo is the main one.
 *  Only admins can write (RLS on cookies and storage). */
export default function CookieEditor({ cookie, onClose, onSaved }) {
  const editing = !!cookie;
  const [name, setName] = useState(cookie?.name ?? '');
  const [description, setDescription] = useState(cookie?.description ?? '');
  const [price, setPrice] = useState(cookie?.price ?? '');
  // one ordered list: saved photos ({url}) and new uploads ({url, file}); the first is the main photo
  const [photos, setPhotos] = useState((cookie?.images?.length ? cookie.images : cookie?.image_url ? [cookie.image_url] : []).map((url) => ({ url })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const blobs = useRef([]);

  useEffect(() => () => blobs.current.forEach((u) => URL.revokeObjectURL(u)), []);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose, saving]);

  // copy the picked files first: the input is cleared right after, which empties its live FileList
  const addFiles = (list) => {
    const picked = [...list].filter((f) => f.type.startsWith('image/')).map((file) => {
      const url = URL.createObjectURL(file);
      blobs.current.push(url);
      return { url, file };
    });
    setPhotos((ps) => [...ps, ...picked]);
  };
  const makeMain = (i) => setPhotos((ps) => [ps[i], ...ps.filter((_, j) => j !== i)]);
  const remove = (i) => setPhotos((ps) => ps.filter((_, j) => j !== i));

  async function save(e) {
    e.preventDefault();
    setError('');
    const p = Number(price);
    if (!name.trim()) return setError('Add a name.');
    if (!Number.isFinite(p) || p <= 0) return setError('Price must be a number above 0.');
    if (!photos.length) return setError('Add at least one photo.');
    setSaving(true);
    try {
      const images = [];
      for (const { url, file } of photos) {
        if (!file) { images.push(url); continue; }
        const path = `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('cookie-images').upload(path, file);
        if (upErr) throw upErr;
        images.push(supabase.storage.from('cookie-images').getPublicUrl(path).data.publicUrl);
      }
      const row = { name: name.trim(), description: description.trim() || null, price: p, images, image_url: images[0] };
      const { error: dbErr } = editing
        ? await supabase.from('cookies').update(row).eq('id', cookie.id)
        : await supabase.from('cookies').insert({ ...row, in_stock: true, is_hidden: false });
      if (dbErr) throw dbErr;
      onSaved();
    } catch (err) {
      setError(err.message || 'Could not save.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[85] flex justify-end bg-ink/50" onClick={() => !saving && onClose()}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={editing ? `Edit ${cookie.name}` : 'Add a cookie'}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-cream p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="disp text-4xl">{editing ? 'Edit cookie' : 'New cookie'}</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-full p-2 hover:bg-blush"><X className="size-6" /></button>
        </div>

        <label className="kicker mb-2">Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Midnight & Milk" className="input-sticker mb-5" />

        <label className="kicker mb-2">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Brown butter cookie with…" className="input-sticker mb-5 resize-none" />

        <label className="kicker mb-2">Price (L.E.)</label>
        <input required type="number" min="1" step="1" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="input-sticker mb-5 w-40" />

        <label className="kicker mb-2">Photos <span className="normal-case tracking-normal text-cocoa/60">(star = main photo)</span></label>
        <div className="mb-3 grid grid-cols-3 gap-3">
          {photos.map(({ url }, n) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-2xl bg-blush">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => makeMain(n)} aria-label="Make main photo"
                className={`absolute left-1.5 top-1.5 rounded-full p-1.5 ${n === 0 ? 'bg-pink text-white' : 'bg-cream/90 text-cocoa'}`}>
                <Star className="size-3.5" fill={n === 0 ? 'currentColor' : 'none'} />
              </button>
              <button type="button" aria-label="Remove photo"
                onClick={() => remove(n)}
                className="absolute right-1.5 top-1.5 rounded-full bg-cream/90 p-1.5 hover:bg-pink-deep hover:text-cream"><X className="size-3.5" /></button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-cocoa/30 text-sm font-semibold hover:bg-blush">
            <ImagePlus className="size-6" /> Add
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          </label>
        </div>

        {error && <p className="mb-3 rounded-xl bg-blush p-3 text-sm font-semibold" role="alert">{error}</p>}
        <div className="mt-auto flex gap-3 pt-4">
          <button type="button" onClick={onClose} disabled={saving} className="btn-pill ghost flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-pill solid flex-1">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add cookie'}</button>
        </div>
      </form>
    </div>
  );
}
