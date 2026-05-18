const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api-production-cbf7.up.railway.app'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  getCategories: () => req('/api/categories'),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString()
    return req(`/api/products${qs ? `?${qs}` : ''}`)
  },

  getProduct: (slug) => req(`/api/products/${slug}`),

  placeOrder: (body, token) =>
    req('/api/orders', { method: 'POST', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),

  getOrders: (token) =>
    req('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),

  getOrder: (id, token) =>
    req(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),

  cancelOrder: (id, token) =>
    req(`/api/orders/${id}/cancel`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }),

  getProfile: (token) =>
    req('/api/profile', { headers: { Authorization: `Bearer ${token}` } }),

  updateProfile: (body, token) =>
    req('/api/profile', { method: 'PUT', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),

  getAddresses: (token) =>
    req('/api/profile/addresses', { headers: { Authorization: `Bearer ${token}` } }),

  addAddress: (body, token) =>
    req('/api/profile/addresses', { method: 'POST', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),

  validateCoupon: (code, order_amount, token) =>
    req('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code, order_amount }), headers: { Authorization: `Bearer ${token}` } }),
}
