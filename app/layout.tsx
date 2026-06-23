import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Folio · Selected Creative Works',
  description:
    'A working folio of brand systems, social creative, posters, identity, and web design — shipped for clients across India and beyond.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Folio · Selected Creative Works',
    description:
      'Brand systems, social creative, identity, posters, web — selected pieces from a working folio.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  )
}
