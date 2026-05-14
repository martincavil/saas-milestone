import type { Metadata } from 'next'
import { Nunito, Syne } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  title: 'saas-milestone — Post your MRR milestones to X automatically',
  description: 'Paste a Stripe key. When your MRR crosses $1, $10, $1k — a card posts to X instantly. Free under $100 MRR.',
  openGraph: {
    title: 'saas-milestone',
    description: 'Auto-post MRR milestones to X the moment they happen.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${nunito.variable} ${syne.variable}`}>
      <body className="min-h-full" style={{ fontFamily: 'var(--font-nunito)' }}>
        {children}
      </body>
    </html>
  )
}
