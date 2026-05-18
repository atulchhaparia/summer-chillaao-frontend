'use client'
import { createContext, useContext, useEffect, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.product_id}-${action.item.variant_id}`
      const existing = state.find(i => `${i.product_id}-${i.variant_id}` === key)
      return existing
        ? state.map(i => `${i.product_id}-${i.variant_id}` === key ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state, { ...action.item, quantity: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => `${i.product_id}-${i.variant_id}` !== action.key)
    case 'UPDATE_QTY':
      return state.map(i => `${i.product_id}-${i.variant_id}` === action.key
        ? { ...i, quantity: Math.max(1, action.qty) } : i)
    case 'CLEAR':
      return []
    case 'INIT':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chillaao_cart')
      if (saved) dispatch({ type: 'INIT', items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('chillaao_cart', JSON.stringify(items))
  }, [items])

  const add    = (item) => dispatch({ type: 'ADD', item })
  const remove = (key)  => dispatch({ type: 'REMOVE', key })
  const update = (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty })
  const clear  = ()    => dispatch({ type: 'CLEAR' })

  const total     = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
