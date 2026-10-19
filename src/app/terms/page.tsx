import Link from 'next/link'

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-600">Last updated: October 19, 2026</p>
      </header>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By accessing and using videotomp3.io, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. Use of the Service</h2>
          <p className="mt-3">
            videotomp3.io provides a free, browser-based tool to convert media files to MP3. Because the conversion happens entirely on your device (client-side), we do not host, store, or have access to any of your files.
          </p>
          <p className="mt-3">
            You agree to use the service only for lawful purposes. You are solely responsible for ensuring you have the necessary rights or permissions to convert any media files. You may not use this tool to infringe upon copyrights or intellectual property rights.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Disclaimer of Warranties</h2>
          <p className="mt-3">
            The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or compatible with every specific file format or device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Limitation of Liability</h2>
          <p className="mt-3">
            In no event shall videotomp3.io be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Changes to Terms</h2>
          <p className="mt-3">
            We reserve the right to modify these terms at any time. We will do so by posting the updated terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new terms.
          </p>
        </section>
      </div>

      <footer className="mt-14 border-t border-slate-200 pt-8">
        <Link href="/" className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700">
          ← Back to the converter
        </Link>
      </footer>
    </article>
  )
}