'use client'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const categoryGradients = {
  'sattuwa':           'from-amber-400 to-yellow-300',
  'aam-panna':         'from-green-400 to-lime-300',
  'khasham-khasss':    'from-blue-300 to-cyan-200',
  'aerated-drinks':    'from-orange-400 to-amber-300',
  'non-alcoholic-beer':'from-yellow-500 to-amber-400',
}

const categoryEmoji = {
  'sattuwa':           '🌾',
  'aam-panna':         '🥭',
  'khasham-khasss':    '🌸',
  'aerated-drinks':    '🫧',
  'non-alcoholic-beer':'🍺',
}

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const gradient = categoryGradients[product.category_slug] || 'from-brand-400 to-brand-300'
  const emoji    = categoryEmoji[product.category_slug]     || '🥤'

  const handleAdd = (e) => {
    e.preventDefault()
    add({
      product_id: product.id,
      variant_id: null,
      name:       product.name,
      category:   product.category_slug,
      price:      product.min_price || product.base_price,
      size:       'small',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link href={`/products/${product.slug}`} className="card group flex flex-col overflow-hidden">
      {/* Gradient image placeholder */}
      <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <span className="text-6xl">{emoji}</span>
        {product.is_bestseller && (
          <span className="absolute top-3 left-3 badge bg-brand-500 text-white">Bestseller</span>
        )}
        {product.is_featured && !product.is_bestseller && (
          <span className="absolute top-3 left-3 badge bg-summer-yellow text-stone-800">Featured</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1">
          {product.category_name}
        </p>
        <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors leading-tight">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-xs text-stone-500 mt-0.5 italic">{product.tagline}</p>
        )}

        {/* Rating */}
        {product.avg_rating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-summer-yellow text-sm">★</span>
            <span className="text-xs font-semibold text-stone-700">{product.avg_rating}</span>
            <span className="text-xs text-stone-400">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div>
            <span className="text-xs text-stone-400">from </span>
            <span className="text-lg font-extrabold text-stone-900">₹{product.min_price || product.base_price}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`btn text-sm px-4 py-2 ${added ? 'bg-summer-green text-white' : 'btn-primary'}`}>
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </Link>
  )
}
