import './globals.css'
import Providers from './providers'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/CartDrawer'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Summer Chillaao — Beat the Heat, Sip the Season',
  description: 'Traditional Indian summer drinks — Sattuwa, Aam Panna, Khasham Khasss, Aerated drinks & Non-Alcoholic Beer, delivered cold.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
