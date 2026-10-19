import type { Metadata } from 'next'
import VideoToMp3Converter from '@/components/VideoToMp3Converter'

export const metadata: Metadata = {
  title: 'Video to MP3 Converter — Free, Private, 100% In-Browser',
  description:
    'Convert MP4, MOV, AVI, WEBM and MKV to MP3 at 320, 192 or 128 kbps in your browser. No sign-up, no uploads, no watermark — WebAssembly + Web Worker conversion.',
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
  },
  {
    question: 'Is there a file size or length limit?',
    answer: 'There is no artificial limit imposed by the tool. The practical ceiling is your device memory — desktop browsers comfortably process files up to roughly 2 GB or two hours, while mobile devices handle shorter clips more smoothly.',
  },
  {
    question: 'Do I need to install software or create an account?',
    answer: 'No installation, no sign-up, no email and no watermark. Open the page, drop a file and download the MP3. After the first visit the WebAssembly engine is cached, so subsequent conversions start instantly and can even run offline.',
  },
] as const

const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'videotomp3.io',
  alternateName: 'Video to MP3 Converter',
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

            <section id="converter" className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:pt-20">
        <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Free Video to MP3 Converter
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-base text-slate-600">
          Convert video to MP3 online instantly with our 100% free tool. Upload MP4, MOV, AVI, or any video file and get high-quality audio in seconds. No signup required, no uploads to servers.
        </p>
        <div className="mt-10">
          <VideoToMp3Converter />
        </div>
      </section>

      <section id="formats" className="scroll-mt-20 border-t border-slate-200 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-semibold tracking-tight">Supported input formats</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Every container below is demuxed locally, its audio track extracted and re-encoded to MP3 — without a single byte leaving the browser.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {INPUT_FORMATS.map((format) => (
              <li key={format} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium tracking-wide text-slate-700">
                {format}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-slate-200 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-slate-200">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
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