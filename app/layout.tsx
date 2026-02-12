import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Email Permutator - Generate Email Combinations',
    template: '%s | Email Permutator',
  },
  description: 'Generate all possible email combinations from first name, last name, and domain. The ultimate tool for sales prospecting and outreach.',
  applicationName: 'Email Permutator',
  authors: [{ name: 'Email Permutator Team' }],
  keywords: ['email permutator', 'email generator', 'sales tools', 'email combinations', 'prospect research', 'lead generation'],
  generator: 'Next.js',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Email Permutator - Generate Email Combinations',
    description: 'Generate all possible email combinations from first name, last name, and domain. Perfect for sales prospecting.',
    url: 'https://email-permutator.com', // Placeholder URL
    siteName: 'Email Permutator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Permutator',
    description: 'Generate all possible email combinations instantly.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
