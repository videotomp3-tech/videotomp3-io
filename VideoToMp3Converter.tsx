'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

type Bitrate = 320 | 192 | 128
type Stage = 'idle' | 'loading-engine' | 'reading-file' | 'extracting' | 'encoding' | 'completed' | 'error'

interface BitrateOption {
  value: Bitrate
  label: string
  hint: string
}

const BITRATES: readonly BitrateOption[] = [
  { value: 320, label: 'High', hint: 'Music & archival' },
  { value: 192, label: 'Medium', hint: 'Balanced default' },
  { value: 128, label: 'Low', hint: 'Speech & podcasts' },
] as const

const STAGE_LABELS: Record<Stage, string> = {
  idle: 'Ready',
  'loading-engine': 'Loading engine…',
  'reading-file': 'Reading file…',
  extracting: 'Extracting audio…',
  encoding: 'Encoding MP3…',
  completed: 'Completed',
  error: 'Conversion failed',
}

const BUSY_STAGES: readonly Stage[] = ['loading-engine', 'reading-file', 'extracting', 'encoding']

const ACCEPTED_EXTENSIONS = [
  '.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v', '.mpeg', '.mpg', '.flv', '.wmv',
  '.wav', '.m4a', '.ogg', '.flac', '.aac',
] as const

const FFMPEG_CORE_VERSION = '0.12.10'
const FFMPEG_CORE_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`
const SOFT_SIZE_LIMIT_BYTES = 2 * 1024 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(0, dot) : name
}

function isAcceptableFile(file: File): boolean {
  if (file.type.startsWith('video/') || file.type.startsWith('audio/')) return true
  const lower = file.name.toLowerCase()
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function detectUnsupportedReason(): string | null {
  if (typeof window === 'undefined') return null
  if (typeof WebAssembly !== 'object' || typeof WebAssembly.instantiate !== 'function') {
    return 'This browser does not support WebAssembly, which is required for on-device conversion.'
  }
  if (typeof Worker === 'undefined') {
    return 'This browser does not support Web Workers, which are required to keep the interface responsive.'
  }
  return null
}

export default function VideoToMp3Converter() {
  const [file, setFile] = useState<File | null>(null)
  const [bitrate, setBitrate] = useState<Bitrate>(320)
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const [mp3Url, setMp3Url] = useState<string | null>(null)
  const [mp3Name, setMp3Name] = useState<string>('audio.mp3')
  const [mp3Size, setMp3Size] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [unsupportedReason, setUnsupportedReason] = useState<string | null>(null)

  const ffmpegRef = useRef<FFmpeg | null>(null)
  const enginePromiseRef = useRef<Promise<FFmpeg> | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)
  const mountedRef = useRef(true)

  const isBusy = BUSY_STAGES.includes(stage)

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  const publishObjectUrl = useCallback((blob: Blob, filename: string) => {
      revokeObjectUrl()
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setMp3Url(url)
      setMp3Name(filename)
      setMp3Size(blob.size)
  }, [revokeObjectUrl])

  useEffect(() => {
    setUnsupportedReason(detectUnsupportedReason())
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      revokeObjectUrl()
      ffmpegRef.current?.terminate()
      ffmpegRef.current = null
      enginePromiseRef.current = null
    }
  }, [revokeObjectUrl])

  const loadEngine = useCallback((): Promise<FFmpeg> => {
    if (ffmpegRef.current) return Promise.resolve(ffmpegRef.current)
    if (enginePromiseRef.current) return enginePromiseRef.current

    const pending = (async () => {
      const { FFmpeg: FFmpegClass } = await import('@ffmpeg/ffmpeg')
      const { toBlobURL } = await import('@ffmpeg/util')

      const ffmpeg = new FFmpegClass()

      ffmpeg.on('progress', ({ progress: raw }) => {
        if (!mountedRef.current) return
        const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0
        setProgress(clamped)
        setStage((current) => (current === 'extracting' ? 'encoding' : current))
      })

      ffmpeg.on('log', ({ message }) => {
        if (!mountedRef.current) return
        if (message.includes('Press [q] to stop')) setStage('encoding')
      })

      await ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      ffmpegRef.current = ffmpeg
      return ffmpeg
    })()

    enginePromiseRef.current = pending.catch((err) => {
      enginePromiseRef.current = null
      throw err
    })

    return enginePromiseRef.current
  }, [])

  const resetOutput = useCallback(() => {
    revokeObjectUrl()
    setMp3Url(null)
    setMp3Size(0)
    setProgress(0)
    setError(null)
  }, [revokeObjectUrl])

  const acceptFile = useCallback((next: File) => {
      if (isBusy) return
      if (!isAcceptableFile(next)) {
        resetOutput()
        setFile(null)
        setStage('error')
        setError('Unsupported file. Choose an MP4, MOV, AVI, WEBM, MKV or a common audio file.')
        return
      }
      if (next.size === 0) {
        resetOutput()
        setFile(null)
        setStage('error')
        setError('That file is empty. Pick another one.')
        return
      }
      resetOutput()
      setFile(next)
      setStage('idle')
  }, [isBusy, resetOutput])

  const reset = useCallback(() => {
    revokeObjectUrl()
    setMp3Url(null)
    setMp3Size(0)
    setProgress(0)
    setError(null)
    setFile(null)
    setStage('idle')
    if (inputRef.current) inputRef.current.value = ''
  }, [revokeObjectUrl])

  const convert = useCallback(async () => {
    if (!file || isBusy) return
    resetOutput()
    setStage('loading-engine')

    const inputName = `input-${Date.now()}`
    const outputName = `output-${Date.now()}.mp3`
    let ffmpeg: FFmpeg | null = null

    try {
      ffmpeg = await loadEngine()
      if (!mountedRef.current) return
      setStage('reading-file')

      const { fetchFile } = await import('@ffmpeg/util')
      const fileData = await fetchFile(file)

      await ffmpeg.writeFile(inputName, fileData)
      if (!mountedRef.current) return

      setStage('extracting')

      await ffmpeg.exec([
        '-i', inputName, '-vn', '-c:a', 'libmp3lame',
        '-b:a', `${bitrate}k`, '-ar', '44100', '-ac', '2', outputName,
      ])

      if (!mountedRef.current) return

      const data = await ffmpeg.readFile(outputName)
      const blob = new Blob([data as BlobPart], { type: 'audio/mpeg' })

      if (blob.size === 0) throw new Error('The encoder produced an empty file.')

      publishObjectUrl(blob, `${stripExtension(file.name)}.mp3`)
      setProgress(1)
      setStage('completed')
    } catch (err) {
      if (!mountedRef.current) return
      revokeObjectUrl()
      setMp3Url(null)
      setStage('error')
      setError(err instanceof Error && err.message ? `Conversion failed: ${err.message}` : 'Conversion failed.')
    } finally {
      if (ffmpeg) {
        await ffmpeg.deleteFile(inputName).catch(() => undefined)
        await ffmpeg.deleteFile(outputName).catch(() => undefined)
      }
    }
  }, [bitrate, file, isBusy, loadEngine, publishObjectUrl, resetOutput, revokeObjectUrl])

  const openPicker = useCallback(() => {
    if (isBusy || unsupportedReason) return
    inputRef.current?.click()
  }, [isBusy, unsupportedReason])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const picked = event.target.files?.[0]
      if (picked) acceptFile(picked)
  }, [acceptFile])

  const handleDropzoneKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openPicker()
      }
  }, [openPicker])

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepthRef.current = Math.max(dragDepthRef.current - 1, 0)
    if (dragDepthRef.current === 0) setIsDragging(false)
  }, [])

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragDepthRef.current = 0
      setIsDragging(false)
      const dropped = event.dataTransfer.files?.[0]
      if (dropped) acceptFile(dropped)
  }, [acceptFile])

  const displayPercent = useMemo(() => {
    switch (stage) {
      case 'loading-engine': return 8
      case 'reading-file': return 18
      case 'extracting': return 30
      case 'encoding': return Math.round(30 + progress * 65)
      case 'completed': return 100
      default: return 0
    }
  }, [progress, stage])

  const statusMessage = useMemo(() => {
    if (unsupportedReason) return unsupportedReason
    if (stage === 'error') return error ?? STAGE_LABELS.error
    if (stage === 'completed') return 'MP3 ready — download it below.'
    if (isBusy) return STAGE_LABELS[stage]
    if (file) return `${file.name} selected. Choose a bitrate, then convert.`
    return 'Drop a video to begin.'
  }, [error, file, isBusy, stage, unsupportedReason])

  const dropzoneEnabled = !isBusy && !unsupportedReason

  return (
    <div className="w-full">
      {/* Functional Differentiation: Software Application status bar */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Engine: WebAssembly Active</span>
          </div>
          <span className="text-xs font-medium text-slate-400">100% Client-Side</span>
        </div>

        <div className="p-4 sm:p-8">
          <div
            role="button"
            tabIndex={dropzoneEnabled ? 0 : -1}
            aria-label={file ? `Selected file: ${file.name}` : 'Drop a video or audio file here'}
            aria-disabled={!dropzoneEnabled}
            onClick={openPicker}
            onKeyDown={handleDropzoneKeyDown}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              'group relative flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200',
              dropzoneEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-70',
              isDragging ? 'scale-[1.01] border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30',
            ].join(' ')}
          >
            <input ref={inputRef} type="file" className="sr-only" accept="video/*,audio/*" onChange={handleInputChange} tabIndex={-1} aria-hidden="true" />
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="size-14 text-slate-400 group-hover:text-blue-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                {file ? file.name : isDragging ? 'Release to load the file' : 'Drop your video here or click to browse'}
              </p>
              <p className="text-sm text-slate-500">
                {file ? formatBytes(file.size) : 'Supports MP4, MOV, AVI, WEBM, MKV and more'}
              </p>
            </div>
            {file && !isBusy && (
              <button type="button" onClick={(e) => { e.stopPropagation(); reset() }} className="absolute right-3 top-3 rounded-md border px-2.5 py-1 text-xs bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                Clear
              </button>
            )}
          </div>

          <fieldset disabled={isBusy || !file} className="mt-6 disabled:opacity-60">
            <legend className="mb-3 text-sm font-semibold text-slate-700">Select Output Quality</legend>
            <div role="radiogroup" className="grid grid-cols-3 gap-3">
              {BITRATES.map((option) => {
                const selected = bitrate === option.value
                return (
                  <button key={option.value} type="button" role="radio" aria-checked={selected} disabled={isBusy || !file} onClick={() => setBitrate(option.value)} className={`rounded-lg border px-2 py-3 text-center transition-colors ${selected ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                    <span className="block text-sm font-bold">{option.value} kbps</span>
                    <span className="mt-0.5 block text-[11px] opacity-80">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={convert} disabled={!file || isBusy || Boolean(unsupportedReason)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors">
              {isBusy ? STAGE_LABELS[stage] : 'Convert to MP3'}
            </button>
            {mp3Url && (
              <a href={mp3Url} download={mp3Name} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                Download MP3 {mp3Size > 0 ? `· ${formatBytes(mp3Size)}` : ''}
              </a>
            )}
          </div>

          {(isBusy || stage === 'completed') && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>{STAGE_LABELS[stage]}</span>
                <span>{displayPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full transition-all duration-300 ${stage === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${displayPercent}%` }} />
              </div>
            </div>
          )}

          <p role="status" className={`mt-4 text-center text-sm font-medium ${stage === 'error' ? 'text-red-600' : 'text-slate-500'}`}>{statusMessage}</p>
        </div>
      </div>

      {/* Trust Badges (Below the tool) */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <svg className="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          100% Free
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <svg className="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          No Signup Required
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <svg className="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Secure Processing
        </span>
      </div>
    </div>
  )
}