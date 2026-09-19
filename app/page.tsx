'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Facebook, LogIn, Menu, Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const fallbackProducts = [
  { name: 'Sunday Morning', detail: 'Hand-painted ceramic', price: '₱399', tone: 'clay', image: null },
  { name: 'Daily Ritual', detail: 'Stoneware coffee cup', price: '₱449', tone: 'sage', image: null },
  { name: 'Good Things', detail: 'Limited quote series', price: '₱499', tone: 'sky', image: null },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState(fallbackProducts)
  const [search, setSearch] = useState('')
  const [activeTone, setActiveTone] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<(typeof fallbackProducts)[number] | null>(null)

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('products')
      .select('id, name, detail, price, tone, image')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setProducts(data.map((product) => ({
            name: product.name,
            detail: product.detail,
            tone: product.tone,
            image: product.image,
            price: `₱${Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}`,
          })))
        }
      })
  }, [])

  const visibleProducts = products.filter((product) => {
    const matchesTone = activeTone === 'all' || product.tone === activeTone
    const matchesSearch = `${product.name} ${product.detail}`.toLowerCase().includes(search.toLowerCase())
    return matchesTone && matchesSearch
  })

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mugs and Co. home">
          <span className="brand-mark">M</span>
          <span>Mugs <i>&</i> Co.</span>
        </a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="nav-order" href="https://www.facebook.com/profile.php?id=61588035627320" target="_blank" rel="noreferrer">
            Order on Facebook <ArrowRight size={15} />
          </a>
          <a className="nav-account" href="/auth"><LogIn size={15} /> Studio login</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Small-batch ceramics · Made with care</p>
          <h1>Make room for<br /><em>good mornings.</em></h1>
          <p className="hero-text">Thoughtfully made mugs for slow sips, long talks, and all the little rituals that make a day yours.</p>
          <a className="button button-dark" href="#collection">Explore the collection <ArrowRight size={17} /></a>
        </div>
        <div className="hero-art" aria-label="A selection of ceramic mugs" role="img">
          <div className="sun-disc" />
          <div className="hero-mug mug-back"><span>☕</span></div>
          <div className="hero-mug mug-front"><span>mugs<br /><small>& co.</small></span></div>
          <div className="hero-sticker">made<br /><strong>for you</strong></div>
        </div>
        <div className="hero-note"><span>01</span><span>Objects with<br />a little soul.</span></div>
      </section>

      <section className="intro-band">
        <p>Warm hands. Better coffee.<br /><strong>More ordinary magic.</strong></p>
        <span className="scribble">✳</span>
        <p className="intro-right">From our studio<br />to your table.</p>
      </section>

      <section className="collection section-wrap" id="collection">
        <div className="section-heading">
          <div><p className="eyebrow">The shelf</p><h2>Find your<br /><em>favorite mug.</em></h2></div>
          <p className="collection-note">Browse the latest pieces from our studio and community makers. Every approved listing is ready for a closer look.</p>
        </div>
        <div className="shop-toolbar">
          <label className="shop-search"><Search size={17} /><span className="sr-only">Search mugs</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the shelf" /></label>
          <div className="tone-filters" aria-label="Filter by color story"><SlidersHorizontal size={16} /><button className={activeTone === 'all' ? 'active' : ''} onClick={() => setActiveTone('all')}>All pieces</button><button className={activeTone === 'clay' ? 'active' : ''} onClick={() => setActiveTone('clay')}>Clay</button><button className={activeTone === 'sage' ? 'active' : ''} onClick={() => setActiveTone('sage')}>Sage</button><button className={activeTone === 'sky' ? 'active' : ''} onClick={() => setActiveTone('sky')}>Sky</button></div>
        </div>
        {visibleProducts.length ? <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <button className="product-card" onClick={() => setSelectedProduct(product)} key={product.name}>
              <div className={`product-art ${product.tone}`}>{product.image ? <img className="product-photo" src={product.image} alt={product.name} /> : <div className="product-mug"><span>{index === 0 ? 'sunny' : index === 1 ? 'slow' : <>good<br />things</>}</span></div>}<span className="product-number">0{index + 1}</span></div>
              <div className="product-meta"><div><h3>{product.name}</h3><p>{product.detail}</p><span className="view-piece">View piece <ArrowRight size={13} /></span></div><strong>{product.price}</strong></div>
            </button>
          ))}
        </div> : <div className="empty-shop"><Search size={22} /><h3>No pieces found</h3><p>Try another search or browse all color stories.</p><button className="text-link" onClick={() => { setSearch(''); setActiveTone('all') }}>Reset browse <ArrowRight size={15} /></button></div>}
      </section>

      <section className="story section-wrap" id="story">
        <div className="story-image"><img src="/hero-bg.jpg" alt="Warm ceramic mugs on a table" /></div>
        <div className="story-copy"><p className="eyebrow">Why Mugs & Co.</p><h2>Everyday objects,<br /><em>made meaningful.</em></h2><p>We believe the things you reach for every day should feel like they belong to you. Our mugs are designed in small batches, finished by hand, and made to collect a few stories along the way.</p><a className="text-link" href="#contact">Meet the studio <ArrowRight size={16} /></a></div>
      </section>

      <section className="contact" id="contact">
        <div><p className="eyebrow">Come say hello</p><h2>Have a mug<br /><em>in mind?</em></h2></div>
        <div className="contact-action"><p>Send us a message for current pieces, custom orders, and gifting.</p><a className="button button-light" href="https://www.facebook.com/profile.php?id=61588035627320" target="_blank" rel="noreferrer"><Facebook size={17} /> Visit our Facebook <ArrowRight size={17} /></a></div>
      </section>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">M</span><span>Mugs <i>&</i> Co.</span></a><p>Small joys, made daily.</p><span>© 2026 Mugs & Co.</span></footer>

      {selectedProduct && <div className="product-dialog-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}><section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onClick={(event) => event.stopPropagation()}><button className="dialog-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={20} /></button><div className={`dialog-art product-art ${selectedProduct.tone}`}>{selectedProduct.image ? <img className="product-photo" src={selectedProduct.image} alt={selectedProduct.name} /> : <div className="product-mug"><span>made<br /><em>for you</em></span></div>}</div><div className="dialog-copy"><p className="eyebrow">A closer look</p><h2 id="product-dialog-title">{selectedProduct.name}</h2><p>{selectedProduct.detail}</p><strong>{selectedProduct.price}</strong><span className="dialog-note">Interested in this piece? Message us on Facebook for availability, custom orders, and delivery details.</span><a className="button button-purple" href={`https://www.facebook.com/profile.php?id=61588035627320&product=${encodeURIComponent(selectedProduct.name)}`} target="_blank" rel="noreferrer"><Facebook size={16} /> Ask about this mug <ArrowRight size={16} /></a></div></section></div>}
    </main>
  )
}
