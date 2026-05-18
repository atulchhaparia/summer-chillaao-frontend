'use client'

const ALL_CATS = [
  { slug: null,                name: 'All Drinks',        emoji: '🥤' },
  { slug: 'sattuwa',           name: 'Sattuwa',           emoji: '🌾' },
  { slug: 'aam-panna',         name: 'Aam Panna',         emoji: '🥭' },
  { slug: 'khasham-khasss',    name: 'Khasham Khasss',    emoji: '🌸' },
  { slug: 'aerated-drinks',    name: 'Aerated Drinks',    emoji: '🫧' },
  { slug: 'non-alcoholic-beer',name: 'NA Beer',           emoji: '🍺' },
]

export default function CategoryBar({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {ALL_CATS.map(cat => (
        <button
          key={cat.slug ?? 'all'}
          onClick={() => onChange(cat.slug)}
          className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 border
            ${active === cat.slug
              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
              : 'bg-white text-stone-600 border-stone-200 hover:border-brand-300 hover:text-brand-600'
            }`}>
          <span>{cat.emoji}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
