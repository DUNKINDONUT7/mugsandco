'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, Check, ImagePlus, LogOut, Pencil, Plus, ShieldCheck, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Product = { id: number; name: string; detail: string; price: number; image: string | null; tone: string; status: 'pending' | 'approved' | 'rejected'; submitted_by: string | null }
type Profile = { display_name: string | null; role: 'user' | 'admin' }

const initialForm = { name: '', detail: '', price: '', tone: 'clay' }

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      if (!supabase) { setNotice('Supabase is not configured.'); setLoading(false); return }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/auth'; return }
      const { data: profileData } = await supabase.from('profiles').select('display_name, role').eq('id', session.user.id).single()
      const productsQuery = supabase.from('products').select('*').order('created_at', { ascending: false })
      const { data: productData } = profileData?.role === 'admin'
        ? await productsQuery
        : await productsQuery.eq('submitted_by', session.user.id)
      setProfile(profileData)
      setProducts(productData || [])
      setLoading(false)
    }
    loadDashboard()
  }, [])

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !imageFile) { setNotice('Please choose a product image first.'); return }
    setSaving(true); setNotice('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    const filePath = `${user.id}/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
    const upload = await supabase.storage.from('product-images').upload(filePath, imageFile, { upsert: false })
    if (upload.error) { setNotice(upload.error.message); setSaving(false); return }
    const { data: publicImage } = supabase.storage.from('product-images').getPublicUrl(filePath)
    const insert = await supabase.from('products').insert({ name: form.name, detail: form.detail, price: Number(form.price), tone: form.tone, image: publicImage.publicUrl, submitted_by: user.id, status: profile?.role === 'admin' ? 'approved' : 'pending' }).select().single()
    if (insert.error) { setNotice(insert.error.message); setSaving(false); return }
    setProducts((current) => [insert.data, ...current]); setForm(initialForm); setImageFile(null); setImagePreview(''); setNotice(profile?.role === 'admin' ? 'Product published.' : 'Submission received. It is waiting for admin approval.'); setSaving(false)
  }

  async function updateStatus(product: Product, status: Product['status']) {
    if (!supabase) return
    const { data, error } = await supabase.from('products').update({ status }).eq('id', product.id).select().single()
    if (!error && data) setProducts((current) => current.map((item) => item.id === product.id ? data : item))
  }

  async function removeProduct(product: Product) {
    if (!supabase || !window.confirm(`Delete ${product.name}?`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (!error) setProducts((current) => current.filter((item) => item.id !== product.id))
  }

  async function signOut() { await supabase?.auth.signOut(); window.location.href = '/' }
  if (loading) return <main className="loading-screen">Loading your studio...</main>

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header"><a className="brand" href="/"><span className="brand-mark">M</span><span>Mugs <i>&</i> Co.</span></a><div className="dashboard-account"><span>{profile?.display_name || 'Studio member'} <b>{profile?.role === 'admin' ? 'ADMIN' : 'MEMBER'}</b></span><button className="icon-button" aria-label="Sign out" onClick={signOut}><LogOut size={18} /></button></div></header>
      <div className="dashboard-content">
        <div className="dashboard-heading"><div><p className="eyebrow">{profile?.role === 'admin' ? 'Control room' : 'Your studio'}</p><h1>{profile?.role === 'admin' ? <>Run the<br /><em>whole shelf.</em></> : <>Share your<br /><em>good things.</em></>}</h1></div><a className="text-link" href="/"><ArrowLeft size={16} /> Back to store</a></div>
        <div className="dashboard-grid">
          <section className="submit-panel"><div className="panel-heading"><div><p className="eyebrow">{profile?.role === 'admin' ? 'Quick publish' : 'New submission'}</p><h2>Add a product</h2></div><Plus size={21} /></div><form onSubmit={handleSubmit} className="product-form">
            <label>Product name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Morning Light" /></label>
            <label>Short description<input value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required placeholder="Hand-painted ceramic" /></label>
            <div className="form-row"><label>Price (PHP)<input type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="499" /></label><label>Color story<select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}><option value="clay">Clay</option><option value="sage">Sage</option><option value="sky">Sky</option></select></label></div>
            <label className="upload-zone">{imagePreview ? <img src={imagePreview} alt="Product preview" /> : <><ImagePlus size={26} /><span>Drop a product photo here</span><small>JPG or PNG · up to 5MB</small></>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} required /></label>
            {notice && <p className="form-message">{notice}</p>}<button className="button button-purple" disabled={saving}>{saving ? 'Saving...' : profile?.role === 'admin' ? 'Publish product' : 'Send for review'} <Upload size={16} /></button>
          </form></section>
          <section className="inventory-panel"><div className="panel-heading"><div><p className="eyebrow">{profile?.role === 'admin' ? 'All submissions' : 'Your activity'}</p><h2>{profile?.role === 'admin' ? 'Inventory' : 'Submissions'}</h2></div><span className="inventory-count">{products.length} items</span></div><div className="inventory-list">{products.length === 0 && <p className="empty-state">No products here yet. Add the first one.</p>}{products.map((product) => <article className="inventory-item" key={product.id}>{product.image ? <img src={product.image} alt={product.name} /> : <div className={`inventory-swatch ${product.tone}`} /> }<div className="inventory-details"><h3>{product.name}</h3><p>{product.detail} · ₱{Number(product.price).toLocaleString('en-PH')}</p><span className={`status status-${product.status}`}>{product.status}</span></div>{profile?.role === 'admin' ? <div className="inventory-actions">{product.status !== 'approved' && <button className="icon-button success" onClick={() => updateStatus(product, 'approved')} aria-label={`Approve ${product.name}`}><Check size={16} /></button>}{product.status !== 'rejected' && <button className="icon-button muted" onClick={() => updateStatus(product, 'rejected')} aria-label={`Reject ${product.name}`}><X size={16} /></button>}<button className="icon-button danger" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></div> : <Pencil size={16} className="muted-icon" />}</article>)}</div></section>
        </div>
        {profile?.role === 'admin' && <div className="admin-note"><ShieldCheck size={20} /><span><strong>Admin access is active.</strong> You can review submissions, publish products, or remove listings from the live shelf.</span></div>}
      </div>
    </main>
  )
}
