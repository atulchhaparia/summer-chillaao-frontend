'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, remove, update, total, itemCount, clear } = useCart()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  const delivery = total >= 199 ? 0 : 29
  const grand    = total + delivery

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col
        transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-bold text-lg text-stone-900">
            Your Cart {itemCount > 0 && <span className="text-brand-500">({itemCount})</span>}
          </h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <span className="text-6xl">🥤</span>
              <p className="text-stone-500 font-medium">Your cart is empty</p>
              <button onClick={() => setOpen(false)}>
                <Link href="/products" className="btn-primary">Browse Drinks</Link>
              </button>
            </div>
          ) : (
            items.map(item => {
              const key = `${item.product_id}-${item.variant_id}`
              return (
                <div key={key} className="card p-3 flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-200 to-brand-100 flex items-center justify-center text-xl flex-shrink-0">
                    🥤
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-stone-900 truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-stone-400 capitalize">{item.size} · {item.volume_ml}ml</p>}
                    <p className="text-sm font-bold text-brand-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => item.quantity === 1 ? remove(key) : update(key, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 transition-colors">
                      {item.quantity === 1 ? '×' : '−'}
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => update(key, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600 transition-colors">
                      +
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 p-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span><span>₹{total}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-summer-green font-semibold">FREE</span> : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-stone-400">Add ₹{199 - total} more for free delivery</p>
              )}
              <div className="flex justify-between font-bold text-base text-stone-900 pt-1 border-t border-stone-100">
                <span>Total</span><span>₹{grand}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
              Proceed to Checkout →
            </Link>
            <button onClick={clear} className="w-full text-xs text-stone-400 hover:text-red-500 transition-colors text-center">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
