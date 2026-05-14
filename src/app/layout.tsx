import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
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
    <html lang="en" className={`h-full antialiased ${syne.variable} ${dmSans.variable}`}>
      <body className="font-sans min-h-full">
        {children}
      </body>
    </html>
  )
}
