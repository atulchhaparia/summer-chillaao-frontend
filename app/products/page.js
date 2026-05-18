'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '../../lib/api'
import ProductCard from '../../components/ProductCard'
import CategoryBar from '../../components/CategoryBar'

function ProductsInner() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')

  const category   = searchParams.get('category')   || null
  const featured   = searchParams.get('featured')   || null
  const bestseller = searchParams.get('bestseller') || null

  useEffect(() => {
    setLoading(true)
    api.getProducts({ category, featured, bestseller })
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [category, featured, bestseller])

  const setCategory = (slug) => {
    const params = new URLSearchParams()
    if (slug) params.set('category', slug)
    router.push(`/products${params.toString() ? `?${params}` : ''}`)
  }

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-6">
        {featured ? '⭐ Featured Drinks' : bestseller ? '🔥 Bestsellers' : '🥤 Our Menu'}
      </h1>

      {/* Search */}
      <input
        className="input mb-5 max-w-sm"
        placeholder="Search drinks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Category filter */}
      <div className="mb-6">
        <CategoryBar active={category} onChange={setCategory} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-stone-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3">😶</span>
          <p className="text-stone-500">No drinks found. Try a different filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {[...Array(8)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-stone-100" />)}
        </div>
      </div>
    }>
      <ProductsInner />
    </Suspense>
  )
}
