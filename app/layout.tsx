import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CanvasWrapper } from '@/components/canvas-wrapper'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DermaVision AI | Advanced Skin Disease Detection',
  description: 'AI-powered skin disease detection and analysis. Get instant, accurate diagnoses using cutting-edge neural network technology.',
  generator: 'v0.app',
  keywords: ['AI', 'skin disease', 'dermatology', 'medical AI', 'diagnosis', 'healthcare'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0E14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased text-foreground bg-transparent`}>
        <CanvasWrapper>
          {children}
        </CanvasWrapper>
        <Analytics />
      </body>
    </html>
  )
}
