import Link from 'next/link'

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Support</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-sm text-slate-600">
          We're here to help. If you have any questions, feedback, or issues with the converter, please reach out.
        </p>
      </header>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Email Support</h2>
          <p className="mt-3">
            For general inquiries, bug reports, or feature requests, please send an email to:
          </p>
          <a 
            href="mailto:support@videotomp3.io" 
            className="mt-2 inline-block text-base font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            support@videotomp3.io
          </a>
          <p className="mt-4 text-slate-500">
            We aim to respond to all inquiries within 24-48 hours.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-3">
            Before reaching out, you might find the answer to your question in our FAQ section.
          </p>
          <Link 
            href="/#faq" 
            className="mt-4 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >
            Read the FAQ <span aria-hidden="true">→</span>
          </Link>
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