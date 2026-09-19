'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Facebook, LogIn, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const fallbackProducts = [
  { name: 'Sunday Morning', detail: 'Hand-painted ceramic', price: '₱399', tone: 'clay', image: null },
  { name: 'Daily Ritual', detail: 'Stoneware coffee cup', price: '₱449', tone: 'sage', image: null },
  { name: 'Good Things', detail: 'Limited quote series', price: '₱499', tone: 'sky', image: null },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState(fallbackProducts)

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
          <a className="nav-order" href="https://www.facebook.com/mugsco" target="_blank" rel="noreferrer">
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
          <div><p className="eyebrow">The shelf</p><h2>Pieces to keep<br /><em>close.</em></h2></div>
          <a className="text-link" href="https://www.facebook.com/mugsco" target="_blank" rel="noreferrer">See all pieces <ArrowRight size={16} /></a>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <a className="product-card" href="https://www.facebook.com/mugsco" target="_blank" rel="noreferrer" key={product.name}>
              <div className={`product-art ${product.tone}`}>{product.image ? <img className="product-photo" src={product.image} alt={product.name} /> : <div className="product-mug"><span>{index === 0 ? 'sunny' : index === 1 ? 'slow' : <>good<br />things</>}</span></div>}<span className="product-number">0{index + 1}</span></div>
              <div className="product-meta"><div><h3>{product.name}</h3><p>{product.detail}</p></div><strong>{product.price}</strong></div>
            </a>
          ))}
        </div>
      </section>

      <section className="story section-wrap" id="story">
        <div className="story-image"><img src="/hero-bg.jpg" alt="Warm ceramic mugs on a table" /></div>
        <div className="story-copy"><p className="eyebrow">Why Mugs & Co.</p><h2>Everyday objects,<br /><em>made meaningful.</em></h2><p>We believe the things you reach for every day should feel like they belong to you. Our mugs are designed in small batches, finished by hand, and made to collect a few stories along the way.</p><a className="text-link" href="#contact">Meet the studio <ArrowRight size={16} /></a></div>
      </section>

      <section className="contact" id="contact">
        <div><p className="eyebrow">Come say hello</p><h2>Have a mug<br /><em>in mind?</em></h2></div>
        <div className="contact-action"><p>Send us a message for current pieces, custom orders, and gifting.</p><a className="button button-light" href="https://www.facebook.com/mugsco" target="_blank" rel="noreferrer"><Facebook size={17} /> Visit our Facebook <ArrowRight size={17} /></a></div>
      </section>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">M</span><span>Mugs <i>&</i> Co.</span></a><p>Small joys, made daily.</p><span>© 2026 Mugs & Co.</span></footer>
    </main>
  )
}
