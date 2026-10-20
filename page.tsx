import type { Metadata } from 'next'
import Link from 'next/link'
import VideoToMp3Converter from '@/components/VideoToMp3Converter'

export const metadata: Metadata = {
  title: 'Free Video to MP3 Converter — Private, No Upload | videotomp3.io',
  description:
    'Convert MP4, MOV, AVI, WEBM, and MKV to MP3 at 320, 192, or 128 kbps directly in your browser. 100% client-side processing with WebAssembly. No sign-up, no uploads.',
  alternates: { canonical: '/' },
}

const FAQ_ITEMS = [
  {
    question: 'How do I convert a video to MP3?',
    answer: 'Drag an MP4, MOV, AVI, WEBM or MKV file onto the uploader above, pick a bitrate (320, 192 or 128 kbps) and press Convert. The MP3 is encoded locally on your device and the download starts immediately — there is no upload step and no waiting queue.',
  },
  {
    question: 'Are my video files uploaded to a server?',
    answer: 'No. videotomp3.io performs 0% server upload. The converter runs FFmpeg compiled to WebAssembly inside a Web Worker in your browser, so the audio track is decoded and re-encoded entirely on your device. Your media never touches our infrastructure and nothing is stored or logged.',
  },
  {
    question: 'Which video and audio formats are supported?',
    answer: 'Input: MP4, MOV, AVI, WEBM, MKV, M4V, MPEG, FLV, WMV, plus audio-only WAV, M4A, OGG, FLAC and AAC. Output: MP3 at 320 kbps, 192 kbps or 128 kbps constant bitrate, 44.1 kHz stereo.',
  },
  {
    question: 'What MP3 bitrate should I choose?',
    answer: 'Use 320 kbps for music and archiving where fidelity matters, 192 kbps as the balanced default for general listening, and 128 kbps for speech, lectures and podcasts where a smaller file is preferable. All three levels are available on every conversion.',
  },
  {
    question: 'Does the converter work on mobile phones and tablets?',
    answer: 'Yes. The uploader works in Safari 15+ on iOS and Chrome, Edge, Firefox and Samsung Internet on Android. Conversion speed depends on your device chip rather than on a server, so modern phones handle a typical music video in a few seconds.',
  }
] as const

const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'videotomp3.io',
  alternateName: 'Free Video to MP3 Converter',
  url: 'https://videotomp3.io/',
  description: 'A browser-based video to MP3 converter that processes MP4, MOV, AVI, WEBM and MKV files locally using WebAssembly and Web Workers. No uploads, no sign-up, no watermark.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Converts MP4, MOV, AVI, WEBM, MKV to MP3',
    'Runs FFmpeg compiled to WebAssembly inside a Web Worker',
    '0% server upload — media never leaves the user device',
    'Custom MP3 bitrates: 320 kbps, 192 kbps and 128 kbps',
    'No sign-up, no email, no watermark',
  ],
}

const FAQ_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const INPUT_FORMATS = ['MP4', 'MOV', 'AVI', 'WEBM', 'MKV', 'M4V', 'MPEG', 'FLV', 'WMV', 'WAV', 'M4A', 'OGG', 'FLAC', 'AAC'] as const

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([SOFTWARE_APPLICATION_SCHEMA, FAQ_PAGE_SCHEMA]),
        }}
      />

      {/* Centerpiece Annotation: Dominant H1 + Entity-dense subtitle + Tool */}
      <section id="converter" className="mx-auto max-w-4xl px-4 pt-8 pb-12 sm:pt-12">
        <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Free Video to MP3 Converter
        </h1>
        
        {/* Token Economy: High density of entities in the first 2% of page tokens */}
        <p className="mx-auto mt-4 max-w-3xl text-balance text-center text-base text-slate-600 sm:text-lg">
          Instantly convert <strong>MP4, MOV, AVI, WEBM, and MKV</strong> to high-quality <strong>MP3 (320kbps, 192kbps, 128kbps)</strong> directly in your browser. No uploads, 100% private, powered by WebAssembly.
        </p>

        <div className="mt-8">
          <VideoToMp3Converter />
        </div>

        {/* Contextual Internal Links (Topical Authority) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span>Need help?</span>
          <Link href="#faq" className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">
            Read our FAQ
          </Link>
          <span className="hidden sm:inline">&bull;</span>
          <Link href="#formats" className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">
            See all supported formats
          </Link>
        </div>
      </section>

      <section id="formats" className="scroll-mt-20 border-t border-slate-200 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Supported input formats</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Every container below is demuxed locally, its audio track extracted and re-encoded to MP3 — without a single byte leaving the browser.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {INPUT_FORMATS.map((format) => (
              <li key={format} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium tracking-wide text-slate-700 shadow-sm">
                {format}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-slate-50/50 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-6">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900 marker:content-none">
                  {item.question}
                  <span aria-hidden="true" className="shrink-0 text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}