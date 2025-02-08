import "./globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"
import { DockWrapper } from "./components/DockWrapper"
import { Footer } from "./components/Footer"
import { ScrollToTop } from "./components/ScrollToTop"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: "#0052FF",
}

export const metadata: Metadata = {
  title: "Live. Play. Work.",
  description: "Live. Play. Work.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Live. Play. Work.",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "Live. Play. Work.",
    description: "A description of Live. Play. Work.",
    url: "https://LivePlayWork.ai",
    siteName: "Live. Play. Work.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Live. Play. Work. is the motto in the A.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live. Play. Work.",
    description: "Live. Play. Work.",
    images: ["/og-image.png"],
    creator: "@navigate_ai",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased bg-[#fafafa] text-[#393939] min-h-screen flex flex-col`}>
          <DockWrapper />
          <main className="flex-grow">
            {children}
          </main>
          <ScrollToTop />
          <Toaster />
          
        </body>
      </html>
    </ClerkProvider>
  )
}