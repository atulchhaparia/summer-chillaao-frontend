'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  // Cart drawer is controlled by a global event so CartDrawer can listen
  const openCart = () => window.dispatchEvent(new Event('open-cart'))

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-brand-500">
          <span className="text-2xl">☀️</span>
          <span>Summer <span className="text-stone-800">Chillaao</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/"         className="hover:text-brand-500 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-brand-500 transition-colors">Menu</Link>
          {user && <Link href="/orders" className="hover:text-brand-500 transition-colors">My Orders</Link>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button onClick={openCart} className="relative p-2 rounded-xl hover:bg-brand-50 transition-colors">
            <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 6h12.8M7 13L5.4 5M17 21a1 1 0 100-2 1 1 0 000 2zm-10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold hover:bg-brand-100 transition-colors">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                  {user.email[0].toUpperCase()}
                </span>
                <span className="hidden md:block">{user.email.split('@')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden">
                  <Link href="/orders" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">My Orders</Link>
                  <button onClick={() => { signOut(); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="btn-primary text-sm px-4 py-2">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
