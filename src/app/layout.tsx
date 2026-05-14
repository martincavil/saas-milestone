import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Milestone MRR — Celebrate your SaaS milestones automatically',
  description: 'Connect Stripe, hit a milestone, auto-post to X. Free until $100 MRR.',
  openGraph: {
    title: 'Milestone MRR',
    description: 'Auto-post your MRR milestones to X (Twitter)',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full bg-[#0a0a0a] text-white`}>
        {children}
      </body>
    </html>
  )
}
