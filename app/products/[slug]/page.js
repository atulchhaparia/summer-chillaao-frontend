'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import { useCart } from '../../../context/CartContext'

const categoryGradients = {
  'sattuwa':           'from-amber-400 to-yellow-300',
  'aam-panna':         'from-green-400 to-lime-300',
  'khasham-khasss':    'from-blue-300 to-cyan-200',
  'aerated-drinks':    'from-orange-400 to-amber-300',
  'non-alcoholic-beer':'from-yellow-500 to-amber-400',
}

export default function ProductDetailPage() {
  const { slug }    = useParams()
  const { add }     = useCart()
  const [product, setProduct] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [added,    setAdded]    = useState(false)

  useEffect(() => {
    api.getProduct(slug).then(p => {
      setProduct(p)
      if (p.variants?.length) setSelected(p.variants[0])
      setLoading(false)
    })
  }, [slug])

  const handleAdd = () => {
    if (!product) return
    add({
      product_id: product.id,
      variant_id: selected?.id ?? null,
      name:       product.name,
      category:   product.category_slug,
      price:      selected?.price ?? product.base_price,
      size:       selected?.size  ?? 'small',
      volume_ml:  selected?.volume_ml ?? null,
    })
    setAdded(true)
    window.dispatchEvent(new Event('open-cart'))
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-64 bg-stone-200 rounded-2xl" />
      <div className="h-8 bg-stone-200 rounded w-2/3" />
      <div className="h-4 bg-stone-200 rounded w-1/3" />
    </div>
  )

  if (!product) return (
    <div className="text-center py-24">
      <p className="text-stone-500">Product not found.</p>
    </div>
  )

  const gradient = categoryGradients[product.category_slug] || 'from-brand-400 to-brand-300'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className={`rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center h-64 md:h-96 text-9xl`}>
          {product.category_slug === 'sattuwa' ? '🌾' :
           product.category_slug === 'aam-panna' ? '🥭' :
           product.category_slug === 'khasham-khasss' ? '🌸' :
           product.category_slug === 'aerated-drinks' ? '🫧' : '🍺'}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-500 uppercase tracking-wide">{product.category_name}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">{product.name}</h1>
            {product.tagline && <p className="text-stone-500 italic mt-1">{product.tagline}</p>}
          </div>

          {/* Rating */}
          {product.avg_rating && (
            <div className="flex items-center gap-2">
              <span className="text-summer-yellow text-lg">★</span>
              <span className="font-bold text-stone-800">{product.avg_rating}</span>
              <span className="text-stone-400 text-sm">({product.review_count} reviews)</span>
            </div>
          )}

          {/* Description */}
          <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <p className="font-semibold text-stone-800 mb-2">Choose Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => setSelected(v)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                      ${selected?.id === v.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-stone-200 text-stone-600 hover:border-brand-300'}`}>
                    <span className="capitalize">{v.size}</span>
                    <span className="block text-xs text-stone-400">{v.volume_ml}ml</span>
                    <span className="block text-sm font-bold text-stone-900">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price + Add */}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-extrabold text-stone-900">
              ₹{selected?.price ?? product.base_price}
            </span>
            <button onClick={handleAdd}
              className={`btn flex-1 text-base py-3 ${added ? 'bg-summer-green text-white' : 'btn-primary'}`}>
              {added ? '✓ Added to Cart' : 'Add to Cart 🛒'}
            </button>
          </div>

          {/* Calories + ingredients */}
          {product.calories && (
            <p className="text-xs text-stone-400">{product.calories} kcal per serving</p>
          )}

          {product.ingredients?.length > 0 && (
            <div>
              <p className="font-semibold text-stone-800 text-sm mb-1">Ingredients</p>
              <p className="text-sm text-stone-500">{product.ingredients.join(', ')}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(t => (
                <span key={t} className="badge bg-brand-50 text-brand-600 capitalize">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Customer Reviews</h2>
          <div className="space-y-3">
            {product.reviews.map((r, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-summer-yellow">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  <span className="text-sm font-semibold text-stone-700">{r.profiles?.full_name || 'Guest'}</span>
                </div>
                {r.title && <p className="font-semibold text-sm text-stone-800">{r.title}</p>}
                {r.body  && <p className="text-sm text-stone-500 mt-0.5">{r.body}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
