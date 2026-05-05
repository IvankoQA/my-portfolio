import type { Metadata } from "next"
import { Inter_Tight, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/providers/convex-provider"
import { AppInit } from "@/components/app-init"
import Header from "./Header"

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter-tight",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ivan Kozenko · Senior AQA Engineer",
  description:
    "Portfolio of Ivan Kozenko — Senior Automation QA Engineer. Playwright, TypeScript, CI/CD.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <AppInit />
            <Header />
            <div className="site-main">{children}</div>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
