import Link from 'next/link'
import { api } from '../lib/api'
import ProductCard from '../components/ProductCard'

export const revalidate = 60

async function getData() {
  const [featured, bestsellers] = await Promise.all([
    api.getProducts({ featured: true }),
    api.getProducts({ bestseller: true }),
  ])
  return { featured, bestsellers }
}

export default async function HomePage() {
  const { featured, bestsellers } = await getData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 via-brand-400 to-summer-yellow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute text-8xl"
              style={{ top: `${Math.random()*80}%`, left: `${Math.random()*90}%`, transform: `rotate(${Math.random()*30-15}deg)` }}>
              ☀️
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative text-center">
          <p className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-3">India's Summer in a Glass</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Beat the Heat.<br />
            <span className="text-summer-yellow">Sip the Season.</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mx-auto mb-8">
            Traditional Sattuwa, tangy Aam Panna, soothing Khasham Khasss &amp; more — delivered ice cold.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn bg-white text-brand-600 hover:bg-brand-50 text-base px-8 py-3 shadow-lg">
              Explore Menu ↓
            </Link>
            <Link href="/auth" className="btn bg-white/20 text-white border border-white/40 hover:bg-white/30 text-base px-8 py-3">
              Sign Up Free
            </Link>
          </div>
          {/* Free delivery banner */}
          <p className="mt-6 text-white/70 text-sm">
            🚚 Free delivery on orders above ₹199 &nbsp;|&nbsp; 🏷️ Use code <span className="font-bold text-white">WELCOME50</span> for ₹50 off
          </p>
        </div>
      </section>

      {/* Category quick-links */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-stone-800 mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { slug:'sattuwa',           name:'Sattuwa',     emoji:'🌾', color:'from-amber-100 to-yellow-50  border-amber-200' },
            { slug:'aam-panna',         name:'Aam Panna',   emoji:'🥭', color:'from-green-100 to-lime-50    border-green-200' },
            { slug:'khasham-khasss',    name:'Khasham Khasss',emoji:'🌸',color:'from-blue-100 to-cyan-50   border-blue-200'  },
            { slug:'aerated-drinks',    name:'Aerated',     emoji:'🫧', color:'from-orange-100 to-amber-50  border-orange-200'},
            { slug:'non-alcoholic-beer',name:'NA Beer',     emoji:'🍺', color:'from-yellow-100 to-amber-50  border-yellow-200'},
          ].map(cat => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}
              className={`card border bg-gradient-to-br ${cat.color} flex flex-col items-center gap-2 p-4 hover:scale-105 transition-transform`}>
              <span className="text-4xl">{cat.emoji}</span>
              <span className="text-sm font-bold text-stone-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-stone-800">⭐ Featured Drinks</h2>
            <Link href="/products?featured=true" className="text-sm text-brand-500 font-semibold hover:text-brand-600">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="bg-brand-50 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-stone-800">🔥 Bestsellers</h2>
              <Link href="/products?bestseller=true" className="text-sm text-brand-500 font-semibold hover:text-brand-600">View all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestsellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-extrabold text-stone-800 mb-8">Why Summer Chillaao?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon:'🌿', title:'100% Natural', desc:'No artificial colours or preservatives. Just real ingredients, real flavour.' },
            { icon:'❄️', title:'Delivered Ice Cold', desc:'Chilled packaging ensures your drinks arrive at the perfect temperature.' },
            { icon:'🇮🇳', title:'Desi & Proud', desc:'Recipes rooted in generations of Indian summer tradition.' },
          ].map(f => (
            <div key={f.title} className="card p-6">
              <span className="text-5xl block mb-3">{f.icon}</span>
              <h3 className="font-bold text-stone-900 mb-1">{f.title}</h3>
              <p className="text-sm text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
