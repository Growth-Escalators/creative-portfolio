'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styles from './VideoModal.module.css'

type Props = {
  /** For video/image, path or URL to the asset. For youtube, the bare video ID. */
  src: string
  /** What kind of asset to render */
  type: 'video' | 'image' | 'youtube'
  /** Heading shown beneath the media (usually the client name) */
  title: string
  /** Optional small line under title (e.g. category) */
  caption?: string
  /** YouTube only — flag a Short so the frame uses 9:16 instead of 16:9 */
  isShort?: boolean
  /** Close handler — fires on overlay click, Esc key, or close button */
  onClose: () => void
}

/* Portal-based lightbox for clicking through to play a video full-size.
   - Uses the canonical "mount once before createPortal" pattern from CLAUDE.md
   - Locks body scroll while open, restores on unmount
   - Escape key closes
   - Clicking the dark backdrop closes; clicking the frame does not */
export default function VideoModal({ src, type, title, caption, isShort, onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!mounted) return null

  /* Build the YouTube embed URL (privacy-friendly nocookie host).
     autoplay=1 starts the video; rel=0 + modestbranding=1 keep YouTube's
     branding minimal at the end. */
  const youtubeEmbed = type === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${src}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : ''

  /* The frame mode flips between widescreen (16:9 — regular YouTube
     videos + local images) and portrait (9:16 — YouTube Shorts + the
     short-form work-card videos). */
  const portrait = type === 'youtube' ? isShort : (type === 'video' || type === 'image')
  const frameClass = `${styles.frame} ${portrait ? styles.framePortrait : styles.frameWide}`

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close video"
      >
        <X size={22} strokeWidth={2.5} />
      </button>

      <div
        className={frameClass}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'youtube' && (
          <div className={styles.iframeWrap}>
            <iframe
              src={youtubeEmbed}
              title={title}
              className={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
        {type === 'video' && (
          <video
            src={src}
            className={styles.media}
            autoPlay
            controls
            playsInline
            loop
            aria-label={title}
          />
        )}
        {type === 'image' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={title} className={styles.media} />
        )}
        <div className={styles.captionWrap}>
          <h3 className={styles.title}>{title}</h3>
          {caption && <p className={styles.caption}>{caption}</p>}
        </div>
      </div>
    </div>,
    document.body
  )
}
