import type { Metadata } from 'next'
import { Nunito, Poppins } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const nunito  = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400','500','600','700','800','900'] })
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['600','700','800'] })

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;var dark=t==='dark'||((!t||t==='system')&&d);document.documentElement.classList.add(dark?'dark':'light');}catch(e){}})();`

export const metadata: Metadata = {
  title: 'saas-milestone — Post your MRR milestones to X automatically',
  description: 'Paste a Stripe key. When your MRR crosses $1, $10, $1k — a card posts to X instantly. Free under $100 MRR.',
  openGraph: { title: 'saas-milestone', description: 'Auto-post MRR milestones to X the moment they happen.', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${nunito.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-nunito">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
