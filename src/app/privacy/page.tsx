import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-600">Last updated: October 19, 2026</p>
      </header>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">In one sentence</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Your media files are converted entirely on your own device. They are never uploaded, never stored, and never seen by us — because there is no upload step to begin with.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">How the conversion works</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            videotomp3.io loads an FFmpeg build compiled to WebAssembly. When you select a video, the browser reads it directly from your disk into an in-memory virtual filesystem, a Web Worker decodes the audio track, and the MP3 is encoded back into memory. The download is served from that same in-memory blob.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">What we collect</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 list-disc ps-5">
            <li><strong>Media files:</strong> nothing. They never reach our servers.</li>
            <li><strong>Personal data:</strong> no accounts, no email, no sign-up.</li>
            <li><strong>Analytics:</strong> aggregate, cookieless page-view counts. No file names, no file contents.</li>
          </ul>
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