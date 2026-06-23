'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import type { Work } from '../_data/works'
import styles from './WorkCard.module.css'

type Aspect = '16/9' | '9/16' | '1/1'
type Platform = 'Meta' | 'Google' | 'YouTube' | 'TikTok' | 'Reels' | 'Shorts'

const PLATFORM_COLOR: Record<Platform, string> = {
  Meta:    '#1877F2',
  Google:  '#34A853',
  YouTube: '#FF0033',
  TikTok:  '#22D3EE',
  Reels:   '#E1306C',
  Shorts:  '#FF6B35',
}

type Props = {
  work: Work
  /** Tile aspect ratio. 16/9 for long-form grid, 9/16 for short-form grid. */
  aspect?: Aspect
  /** Optional platform badge in the top-left corner (e.g. "Meta", "YouTube"). */
  platform?: Platform
  /** Fires when the card is clicked. When set, the card becomes a button-ish surface
      (cursor: pointer, keyboard-activatable). Used to open the lightbox. */
  onClick?: () => void
  index?: number
}

export default function WorkCard({ work, aspect = '1/1', platform, onClick, index = 0 }: Props) {
  const { palette, variant } = work
  const clickable = Boolean(onClick)

  return (
    <motion.article
      className={styles.card}
      data-aspect={aspect}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
      } : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={
        {
          '--w-bg': palette.bg,
          '--w-fg': palette.fg,
          '--w-accent': palette.accent,
          ...(clickable ? { cursor: 'pointer' } : null),
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.canvas}>
        {variant === 'initial' && <InitialComp work={work} />}
        {variant === 'mark' && <MarkComp work={work} />}
        {variant === 'field' && <FieldComp work={work} />}
        {variant === 'poster' && <PosterComp work={work} />}
        {variant === 'spec' && <SpecComp work={work} />}
        {variant === 'media' && <MediaComp work={work} />}

        {platform && (
          <span
            className={styles.platformBadge}
            style={{ '--badge-color': PLATFORM_COLOR[platform] } as React.CSSProperties}
          >
            <span className={styles.platformDot} aria-hidden />
            {platform}
          </span>
        )}

        {/* Numbered badge (01, 02, …) — gives the grid a sense of curation */}
        <span className={styles.numberBadge} aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Centered play button overlay — pulses subtly at rest */}
        <span className={styles.playBtn} aria-hidden>
          <Play size={24} fill="currentColor" strokeWidth={0} style={{ marginLeft: 3 }} />
        </span>

        {/* Hover panel — slides up from bottom with client + title */}
        <div className={styles.hoverPanel}>
          <div className={styles.hoverTagRow}>
            <span className={styles.hoverTag}>{work.shortTag}</span>
            <span>{work.year}</span>
          </div>
          <h3 className={styles.hoverTitle}>{work.client}</h3>
        </div>
      </div>
    </motion.article>
  )
}

/* ───────── variant: 'initial' — massive single letter ───────── */
function InitialComp({ work }: { work: Work }) {
  const letter = work.composition.initial ?? work.client[0]
  return (
    <div className={styles.initial}>
      <span className={styles.initialLetter} aria-hidden>{letter}</span>
    </div>
  )
}

/* ───────── variant: 'mark' — abstract brand-mark in SVG ───────── */
function MarkComp({ work }: { work: Work }) {
  const shape = work.composition.mark ?? 'orbit'
  return (
    <div className={styles.markWrap}>
      <svg viewBox="0 0 200 200" className={styles.markSvg} aria-hidden>
        {shape === 'orbit' && (
          <>
            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--w-fg)" strokeWidth="1.5" />
            <circle cx="100" cy="40" r="10" fill="var(--w-accent)" />
            <line x1="100" y1="100" x2="100" y2="40" stroke="var(--w-fg)" strokeWidth="1" />
          </>
        )}
        {shape === 'arch' && (
          <>
            <path d="M 40 150 Q 100 30 160 150" fill="none" stroke="var(--w-fg)" strokeWidth="3" />
            <line x1="40" y1="150" x2="160" y2="150" stroke="var(--w-accent)" strokeWidth="2" />
            <circle cx="100" cy="80" r="4" fill="var(--w-accent)" />
          </>
        )}
        {shape === 'split' && (
          <>
            <rect x="40" y="40" width="60" height="120" fill="var(--w-fg)" />
            <rect x="100" y="40" width="60" height="120" fill="var(--w-accent)" />
          </>
        )}
        {shape === 'rule' && (
          <>
            <line x1="30" y1="100" x2="170" y2="100" stroke="var(--w-fg)" strokeWidth="2" />
            <circle cx="100" cy="100" r="6" fill="var(--w-accent)" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="var(--w-fg)" strokeWidth="1" strokeDasharray="3 4" />
          </>
        )}
        {shape === 'eclipse' && (
          <>
            <circle cx="90" cy="100" r="56" fill="var(--w-accent)" />
            <circle cx="115" cy="100" r="56" fill="var(--w-bg)" />
            <circle cx="115" cy="100" r="56" fill="none" stroke="var(--w-fg)" strokeWidth="1.5" />
          </>
        )}
      </svg>
    </div>
  )
}

/* ───────── variant: 'field' — color field + caption stack ───────── */
function FieldComp({ work }: { work: Work }) {
  const lines = work.composition.fieldLines ?? [work.client.toUpperCase()]
  return (
    <div className={styles.field}>
      <div className={styles.fieldLines}>
        {lines.map((l, i) => (
          <span key={i} className={styles.fieldLine} style={{ opacity: 1 - i * 0.12 }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────── variant: 'poster' — vertical typographic stack ───────── */
function PosterComp({ work }: { work: Work }) {
  const stack = work.composition.posterStack ?? [work.client.toUpperCase()]
  return (
    <div className={styles.poster}>
      <div className={styles.posterStack}>
        {stack.map((word, i) => (
          <span
            key={i}
            className={styles.posterWord}
            style={{ fontSize: `${100 - (i * 8) % 50}%` }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────── variant: 'media' — real video or image with hover-play ─────────
   Image: lazy-loaded, object-cover. Video: poster frame at rest, plays muted
   on hover, pauses + rewinds on leave. preload="metadata" keeps initial page
   weight near-zero (only the first frame is fetched until intent). */
function MediaComp({ work }: { work: Work }) {
  const m = work.composition.media
  const videoRef = useRef<HTMLVideoElement>(null)
  if (!m) return null

  if (m.type === 'image') {
    return (
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.mediaEl}
          src={m.src}
          alt={work.client}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={styles.media}
      onMouseEnter={() => {
        videoRef.current?.play().catch(() => { /* autoplay blocked — ignore */ })
      }}
      onMouseLeave={() => {
        const v = videoRef.current
        if (v) { v.pause(); v.currentTime = 0 }
      }}
    >
      <video
        ref={videoRef}
        className={styles.mediaEl}
        src={m.src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={work.client}
      />
    </div>
  )
}

/* ───────── variant: 'spec' — project spec sheet rows ───────── */
function SpecComp({ work }: { work: Work }) {
  const rows = work.composition.specRows ?? []
  return (
    <div className={styles.spec}>
      <div className={styles.specHeader}>
        <span>SPEC</span>
        <span>{work.year}</span>
      </div>
      <ul className={styles.specRows}>
        {rows.slice(0, 4).map((r, i) => (
          <li key={i} className={styles.specRow}>
            <span className={styles.specKey}>{r.k}</span>
            <span className={styles.specVal}>{r.v}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
