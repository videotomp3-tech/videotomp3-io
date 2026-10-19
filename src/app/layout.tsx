import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Video to MP3 Converter — Free, Private, No Upload | videotomp3.io',
  description: 'Convert MP4, MOV, AVI, WEBM and MKV to MP3 directly in your browser. No sign-up, 100% client-side processing.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
        
        {/* Header - يحاكي موقع كوراي */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
          <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
              videotomp3<span className="text-blue-600">.io</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <ul className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                <li><a href="/#features" className="hover:text-blue-600">Features</a></li>
                <li><a href="/#faq" className="hover:text-blue-600">FAQ</a></li>
              </ul>
              
              {/* محدد اللغة - مهم جداً لسيو كوراي */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md px-2 py-1">
                <span className="text-xs">🌐</span>
                <select className="bg-transparent outline-none cursor-pointer">
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                  <option value="es">ES</option>
                  <option value="ar">AR</option>
                </select>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer - يحاكي فوتر كوراي الداكن */}
        <footer className="bg-slate-900 text-slate-300">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                videotomp3<span className="text-blue-500">.io</span>
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                The most reliable free video to MP3 conversion service available online. 100% private, running entirely in your browser.
              </p>
            </div>

            <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-sm">
              <p>© {new Date().getFullYear()} videotomp3.io. All rights reserved.</p>
              <nav className="flex gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </nav>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}