'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../lib/api'
import Link from 'next/link'

const STATUS_STYLES = {
  pending:          'bg-yellow-100 text-yellow-800',
  confirmed:        'bg-blue-100   text-blue-800',
  preparing:        'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered:        'bg-green-100  text-green-800',
  cancelled:        'bg-red-100    text-red-700',
}

export default function OrdersPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth')
  }, [user, authLoading])

  useEffect(() => {
    if (!token) return
    api.getOrders(token).then(setOrders).finally(() => setLoading(false))
  }, [token])

  if (authLoading || loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-stone-100" />)}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📋</span>
          <p className="text-stone-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="btn-primary">Browse Menu →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-stone-900">Order #{order.id.slice(0,8).toUpperCase()}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
                <span className={`badge ${STATUS_STYLES[order.status] || 'bg-stone-100 text-stone-600'} capitalize`}>
                  {order.status.replace(/_/g,' ')}
                </span>
              </div>

              {/* Items preview */}
              <div className="space-y-1 mb-3">
                {order.order_items?.slice(0,3).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-stone-600">
                    <span>{item.products?.name} {item.product_variants?.size ? `(${item.product_variants.size})` : ''} × {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
                {order.order_items?.length > 3 && (
                  <p className="text-xs text-stone-400">+{order.order_items.length - 3} more items</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="text-sm">
                  <span className="text-stone-500">Total · </span>
                  <span className="font-bold text-stone-900">₹{order.total_amount}</span>
                  <span className="text-stone-400 ml-2 capitalize">· {order.payment_method}</span>
                </div>
                <Link href={`/orders/${order.id}`} className="btn-outline text-xs px-3 py-1.5">
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
