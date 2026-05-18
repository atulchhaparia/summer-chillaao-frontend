'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { api } from '../../lib/api'
import Link from 'next/link'

export default function CheckoutPage() {
  const { user, token, loading: authLoading } = useAuth()
  const { items, total, clear } = useCart()
  const router = useRouter()

  const [addresses, setAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [payment, setPayment]     = useState('cod')
  const [coupon,  setCoupon]      = useState('')
  const [discount, setDiscount]   = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [notes,   setNotes]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [placed,  setPlaced]      = useState(null)

  // New address form
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState({ full_name:'', phone:'', line1:'', city:'', state:'', pincode:'', label:'Home' })

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth')
  }, [user, authLoading])

  useEffect(() => {
    if (!token) return
    api.getAddresses(token).then(data => {
      setAddresses(data)
      const def = data.find(a => a.is_default)
      if (def) setSelectedAddr(def.id)
    })
  }, [token])

  const delivery = total >= 199 ? 0 : 29
  const grand    = Math.max(0, total + delivery - discount)

  const applyCoupon = async () => {
    setCouponMsg('')
    try {
      const res = await api.validateCoupon(coupon, total, token)
      if (res.valid) {
        setDiscount(res.coupon.discount_amount || 0)
        setCouponMsg(`✓ ${res.coupon.description || 'Coupon applied!'}`)
      } else {
        setCouponMsg(res.error || 'Invalid coupon')
        setDiscount(0)
      }
    } catch { setCouponMsg('Could not validate coupon') }
  }

  const saveAddress = async () => {
    try {
      const addr = await api.addAddress({ ...addrForm, is_default: addresses.length === 0 }, token)
      setAddresses(prev => [...prev, addr])
      setSelectedAddr(addr.id)
      setShowAddrForm(false)
    } catch (err) { alert(err.message) }
  }

  const placeOrder = async () => {
    if (!selectedAddr) return alert('Please select a delivery address')
    setLoading(true)
    try {
      const body = {
        items: items.map(i => ({ product_id: i.product_id, variant_id: i.variant_id, quantity: i.quantity })),
        address_id: selectedAddr,
        payment_method: payment,
        coupon_code: coupon || undefined,
        notes: notes || undefined,
      }
      const res = await api.placeOrder(body, token)
      clear()
      setPlaced(res)
    } catch (err) { alert(err.message) }
    finally { setLoading(false) }
  }

  if (placed) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card p-10 text-center max-w-sm w-full">
        <span className="text-6xl block mb-4">🎉</span>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Order Placed!</h2>
        <p className="text-stone-500 mb-1">Order ID: <span className="font-mono font-bold text-stone-700">#{placed.order_id?.slice(0,8).toUpperCase()}</span></p>
        <p className="text-stone-500 mb-6">Total paid: <span className="font-bold text-stone-900">₹{placed.total_amount}</span></p>
        <Link href="/orders" className="btn-primary w-full justify-center">Track Order →</Link>
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div>
        <span className="text-6xl block mb-4">🛒</span>
        <p className="text-stone-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse Menu →</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left — address + payment */}
        <div className="md:col-span-3 space-y-6">
          {/* Delivery address */}
          <div className="card p-5">
            <h2 className="font-bold text-stone-900 mb-4">Delivery Address</h2>
            {addresses.map(a => (
              <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 transition-all
                ${selectedAddr === a.id ? 'border-brand-500 bg-brand-50' : 'border-stone-200 hover:border-brand-200'}`}>
                <input type="radio" className="mt-1" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} />
                <div className="text-sm">
                  <p className="font-semibold text-stone-800">{a.full_name} · {a.label}</p>
                  <p className="text-stone-500">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                  <p className="text-stone-500">{a.city}, {a.state} — {a.pincode}</p>
                  <p className="text-stone-500">{a.phone}</p>
                </div>
              </label>
            ))}
            <button onClick={() => setShowAddrForm(!showAddrForm)} className="btn-outline w-full mt-2 text-sm">
              {showAddrForm ? 'Cancel' : '+ Add New Address'}
            </button>

            {showAddrForm && (
              <div className="mt-4 space-y-3">
                {[['full_name','Full Name'],['phone','Phone'],['line1','Address Line 1'],['city','City'],['state','State'],['pincode','Pincode']].map(([k,label]) => (
                  <div key={k}>
                    <label className="text-xs font-medium text-stone-600 mb-1 block">{label}</label>
                    <input className="input" value={addrForm[k]} onChange={e => setAddrForm(p => ({ ...p, [k]: e.target.value }))} />
                  </div>
                ))}
                <button onClick={saveAddress} className="btn-primary w-full">Save Address</button>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold text-stone-900 mb-4">Payment Method</h2>
            {[['cod','Cash on Delivery 💵'],['upi','UPI 📱'],['card','Card 💳']].map(([val, label]) => (
              <label key={val} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 transition-all
                ${payment === val ? 'border-brand-500 bg-brand-50' : 'border-stone-200 hover:border-brand-200'}`}>
                <input type="radio" checked={payment === val} onChange={() => setPayment(val)} />
                <span className="text-sm font-medium text-stone-800">{label}</span>
              </label>
            ))}
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h2 className="font-bold text-stone-900 mb-3">Order Notes (optional)</h2>
            <textarea className="input h-20 resize-none" placeholder="Any special instructions..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Right — order summary */}
        <div className="md:col-span-2">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => {
                const key = `${item.product_id}-${item.variant_id}`
                return (
                  <div key={key} className="flex justify-between text-sm text-stone-600">
                    <span className="truncate max-w-[60%]">{item.name} {item.size ? `(${item.size})` : ''} ×{item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                )
              })}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input className="input flex-1 text-sm" placeholder="Coupon code" value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())} />
              <button onClick={applyCoupon} className="btn-outline px-3 text-sm">Apply</button>
            </div>
            {couponMsg && (
              <p className={`text-xs mb-3 ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>
            )}

            <div className="space-y-1.5 text-sm border-t border-stone-100 pt-3">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${delivery}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount}</span></div>
              )}
              <div className="flex justify-between font-bold text-base text-stone-900 pt-2 border-t border-stone-100">
                <span>Total</span><span>₹{grand}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={loading || !selectedAddr} className="btn-primary w-full mt-5 py-3 text-base">
              {loading ? 'Placing Order...' : `Place Order · ₹${grand}`}
            </button>
            {!selectedAddr && <p className="text-xs text-red-500 mt-2 text-center">Please add a delivery address</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
