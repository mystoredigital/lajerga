import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "LaJerga - Diccionario de Jergas Latinoamericanas",
    template: "%s | LaJerga",
  },
  description: "Diccionario colaborativo de jergas y modismos del español latinoamericano. Descubre expresiones de Colombia, México, Argentina, Venezuela, Perú, Chile y más.",
  keywords: ["jergas", "modismos", "español", "latinoamérica", "diccionario", "slang", "colombianismos", "mexicanismos", "argentinismos"],
  authors: [{ name: "LaJerga" }],
  creator: "LaJerga",
  metadataBase: new URL("https://lajerga.app"),
  openGraph: {
    type: "website",
    locale: "es_LA",
    url: "https://lajerga.app",
    siteName: "LaJerga",
    title: "LaJerga - Diccionario de Jergas Latinoamericanas",
    description: "Descubre y comparte jergas y modismos del español latinoamericano.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaJerga - Diccionario de Jergas Latinoamericanas",
    description: "Descubre y comparte jergas y modismos del español latinoamericano.",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1321706024272690"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://umami.mystoredigital.cloud/script.js"
          data-website-id="b00b99d1-b006-418f-99a1-5e74ae19c3cd"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
