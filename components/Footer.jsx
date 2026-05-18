import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-white font-extrabold text-lg mb-2">☀️ Summer Chillaao</p>
          <p className="text-sm leading-relaxed">
            Traditional Indian summer coolers delivered cold — Sattuwa, Aam Panna, Khasham Khasss &amp; more.
          </p>
        </div>
        <div>
          <p className="text-white font-bold mb-3">Menu</p>
          <ul className="space-y-1.5 text-sm">
            {['Sattuwa','Aam Panna','Khasham Khasss','Aerated Drinks','NA Beer'].map(c => (
              <li key={c}><Link href={`/products?category=${c.toLowerCase().replace(/ /g,'-')}`} className="hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-bold mb-3">Coupons</p>
          <ul className="space-y-1.5 text-sm font-mono">
            <li><span className="text-summer-yellow">CHILLAAO10</span> — ₹10 off</li>
            <li><span className="text-summer-yellow">SUMMER20</span>   — 20% off ₹200+</li>
            <li><span className="text-summer-yellow">WELCOME50</span>  — ₹50 off first order</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 text-center text-xs py-4 text-stone-600">
        © {new Date().getFullYear()} Summer Chillaao. Built with Supabase · Railway · Vercel.
      </div>
    </footer>
  )
}
