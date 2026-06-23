'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'

import { WORKS, type WorkBucket } from '../_data/works'
import WorkCard from './WorkCard'
import VideoModal from './VideoModal'
import styles from './CreativeClient.module.css'

const easeOut = [0.16, 1, 0.3, 1] as const

/* ─────────── Capabilities + industries marquee data ─────────── */
const CAPABILITIES = [
  'Meta Ads', 'Google Ads', 'YouTube Ads', 'TikTok Ads', 'UGC Reels',
  'Brand Films', 'Podcast Editing', 'Motion Design', 'Static Ad Creative',
  'Personal Branding', 'Web Design', 'Landing Pages',
]
const INDUSTRIES = [
  'Healthcare', 'D2C Brands', 'B2B SaaS', 'Wellness', 'YouTube Automation',
  'Real Estate', 'Fashion', 'Education', 'Travel', 'Hospitality',
  'E-Commerce', 'Coaches & Creators',
]

/* ─────────── Data: services — Video Editing + Creative Ads ─────────── */
const SERVICES = [
  {
    title: 'Creative Ads',
    body: 'Scroll-stopping ad creative built to convert — paid social, performance video, hook-first UGC.',
    bullets: [
      'Meta · Google · YouTube · TikTok ad creative',
      'UGC video ads with hooks built for retention',
      'A/B variants — test, learn, double down',
    ],
    tags: ['Meta Ads', 'Google Ads', 'YouTube Ads', 'TikTok', 'UGC'],
  },
  {
    title: 'Video Editing',
    body: 'Long-form and short-form edits that build the brand while they build the audience.',
    bullets: [
      'Long-form YouTube videos & brand films',
      'Shorts · Reels · TikTok cuts in volume',
      'Podcast editing, social cuts & motion design',
    ],
    tags: ['YouTube', 'Reels', 'Shorts', 'TikTok', 'Podcast', 'Motion'],
  },
]

/* ─────────── Image gallery — real studio output (6-tile bento) ─────────── */
const GALLERY = [
  { src: '/media/gallery-1.png', client: 'Brand Landing',  category: 'Hero · Web', badge: 'Featured' },
  { src: '/media/gallery-2.png', client: 'Brand Page',     category: 'Conversion · Web', badge: 'Web' },
  { src: '/media/gallery-3.png', client: 'Brand Identity', category: 'System · Visual', badge: 'Identity' },
  { src: '/media/gallery-4.png', client: 'Ad Creative',    category: 'Performance · Static', badge: 'Static Ad' },
  { src: '/media/gallery-5.png', client: 'Wedding Brand',  category: 'Lifestyle · Post', badge: 'Social' },
  { src: '/media/odra-glow.png', client: 'Odra Organics',  category: 'Wellness · Post', badge: 'Social' },
]

/* ─────────── Real impact stats — pared down to the 2 most credible numbers ─────────── */
const IMPACT_STATS = [
  { num: 187, suffix: '+',  label: 'Brands scaled' },
  { num: 20,  suffix: 'M+', label: 'Reach generated' },
]

/* Animated number — counts 0 → end on scroll into view. */
function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const dur = 1500
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setN(Math.round(end * ease))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, end])
  return <span ref={ref}>{n}{suffix}</span>
}

/* Which short-form work gets which platform badge — keeps the showcase honest
   (some cards are paid creative for the platform shown). */
const SHORT_FORM_PLATFORMS: Record<string, 'Meta' | 'Google' | 'YouTube' | 'TikTok' | 'Reels' | 'Shorts' | undefined> = {
  'elixzor':        'YouTube',
  'dr-mukesh':      'Meta',
  'flight-ticket-fare': 'Google',
  'kabir-saas':     'TikTok',
  'tanya-fmcg':     'Reels',
  'ananya-studio':  'Meta',
}

/* ─────────── Testimonials — first two are real on-camera video clients
   (Plysolene + Dr. Balram Harsana). The rest are text Google reviews
   sourced from the main site's testimonials.js. We do NOT put words in
   the video clients' mouths — copy is a neutral "watch the story" CTA. */
const TESTIMONIALS = [
  {
    quote: "Hear Plysolene's full story — straight from the client, in their own words. Tap play for the unedited testimonial.",
    name: 'Plysolene',
    role: 'Video Testimonial · Press play',
    gradient: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
    youtubeId: 'Yi5enK4yrJM',
    isShort: false,
  },
  {
    quote: "Dr. Balram Harsana on the work we did together — on camera, in his own words. Tap play to watch.",
    name: 'Dr. Balram Harsana',
    role: 'Video Review · Press play',
    gradient: 'linear-gradient(135deg, #6C63FF, #9c8fff)',
    youtubeId: 'Hzff2yAJ_UA',
    isShort: true,
  },
  {
    quote: 'Excellent affordable service. The team delivered exactly what was promised — on time and within budget. Very impressed with the quality and professionalism.',
    name: 'Dr. Sumit Doraya',
    role: 'Google Review · ★★★★★',
    gradient: 'linear-gradient(135deg, #00D4AA, #00b894)',
  },
  {
    quote: 'Best service — truly goes above and beyond for their clients. Exceptional results and a fantastic team to work with.',
    name: 'Gaurav Thakur',
    role: 'Google Review · ★★★★★',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
  },
  {
    quote: 'Amazing experience working with the team. Very professional, creative, and results-driven. Highly recommend them to any business looking to grow.',
    name: 'Diwakar Kumar',
    role: 'Google Review · ★★★★★',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
  },
  {
    quote: 'Gave them a design project for my relative’s wedding card and the work was great. Team is very co-operative. Very happy with the output and the whole experience.',
    name: 'Akash Meena',
    role: 'Google Review · ★★★★★',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
]

type TabKey = WorkBucket
const TABS: { key: TabKey; label: string }[] = [
  { key: 'reels',  label: 'Reels'      },
  { key: 'shorts', label: 'Shorts'     },
  { key: 'ads',    label: 'Ad Creative'},
]

export default function CreativeClient() {
  const prefersReduced = useReducedMotion()

  // Split works for the long-form (16:9, 4 pieces) and short-form (9:16, rest) grids.
  const longFormWorks  = useMemo(() => WORKS.slice(0, 4), [])
  const shortFormWorks = useMemo(() => WORKS.slice(4),    [])

  /* Short-form filter — counts per bucket + currently active tab.
     Default opens on whichever bucket has the most cards so the section
     doesn't render thin on first load. */
  const bucketCounts = useMemo(() => {
    const c: Record<WorkBucket, number> = { reels: 0, shorts: 0, ads: 0 }
    shortFormWorks.forEach((w) => { if (w.bucket) c[w.bucket]++ })
    return c
  }, [shortFormWorks])
  const defaultTab = useMemo<TabKey>(() => {
    return (Object.entries(bucketCounts) as [WorkBucket, number][])
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'reels'
  }, [bucketCounts])
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab)
  const filteredShortForm = useMemo(
    () => shortFormWorks.filter((w) => w.bucket === activeTab),
    [shortFormWorks, activeTab]
  )

  /* Lightbox state — null when closed, an object describing the asset when open.
     For YouTube, `src` is the video ID (not a full URL) and `isShort` controls aspect. */
  const [lightbox, setLightbox] = useState<
    | { src: string; type: 'video' | 'image' | 'youtube'; title: string; caption?: string; isShort?: boolean }
    | null
  >(null)

  /* Testimonials carousel — scroll one card-width on "next" */
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollNext = useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const step = (first?.offsetWidth ?? 600) + 24
    // Loop back to start when we hit the right edge
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: step, behavior: 'smooth' })
    }
  }, [])

  /* ─────────── Smart cursor (violet dot → "View →" pill over cards)
                   plus a soft mouse-trail of light cyan pills following the cursor.
     The trail is a pool of N divs; each follows the one in front of it with a lerp,
     and opacity tapers down the chain so it looks like a comet tail. */
  const crosshairRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReduced) return
    /* Touch devices have no real hover — skip the smart cursor + trail entirely */
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return
    const el = crosshairRef.current
    if (!el) return
    el.textContent = 'View →'

    /* ── Mouse trail pool ── */
    const TRAIL_N = 14
    const trail: HTMLDivElement[] = []
    for (let i = 0; i < TRAIL_N; i++) {
      const d = document.createElement('div')
      d.className = styles.trailDot
      const t = i / (TRAIL_N - 1) // 0 at head, 1 at tail
      // Opacity tapers from 0.65 → 0; size tapers from 14 → 6
      d.style.opacity = `${0.65 * (1 - t)}`
      const s = 14 - 8 * t
      d.style.width = `${s}px`
      d.style.height = `${s}px`
      document.body.appendChild(d)
      trail.push(d)
    }
    const positions: { x: number; y: number }[] =
      Array.from({ length: TRAIL_N }, () => ({ x: -100, y: -100 }))

    let raf = 0
    let mx = -100, my = -100
    // Cursor "View" pill smoothed position
    let cx = -100, cy = -100

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }

    const loop = () => {
      // Cursor pill smooth follow
      cx += (mx - cx) * 0.20
      cy += (my - cy) * 0.20
      el.style.left = `${cx}px`
      el.style.top = `${cy}px`

      // Trail chain follow — head chases mouse, each subsequent dot chases the previous
      positions[0].x += (mx - positions[0].x) * 0.34
      positions[0].y += (my - positions[0].y) * 0.34
      for (let i = 1; i < TRAIL_N; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.34
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.34
      }
      for (let i = 0; i < TRAIL_N; i++) {
        const d = trail[i]
        // Pull width/height back out for the offset so the dot is centered
        const size = parseFloat(d.style.width) / 2
        d.style.transform = `translate3d(${positions[i].x - size}px, ${positions[i].y - size}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    const showCursor = () => el.classList.add(styles.cursorActive)
    const hideCursor = () => {
      el.classList.remove(styles.cursorActive)
      el.classList.remove(styles.cursorView)
    }
    const cardEnter = () => el.classList.add(styles.cursorView)
    const cardLeave = () => el.classList.remove(styles.cursorView)

    document.addEventListener('mousemove', onMove)
    document.body.addEventListener('mouseenter', showCursor)
    document.body.addEventListener('mouseleave', hideCursor)
    showCursor()
    const cards = document.querySelectorAll<HTMLElement>('article[data-aspect]')
    cards.forEach((c) => {
      c.addEventListener('mouseenter', cardEnter)
      c.addEventListener('mouseleave', cardLeave)
    })
    raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.body.removeEventListener('mouseenter', showCursor)
      document.body.removeEventListener('mouseleave', hideCursor)
      cards.forEach((c) => {
        c.removeEventListener('mouseenter', cardEnter)
        c.removeEventListener('mouseleave', cardLeave)
      })
      if (raf) cancelAnimationFrame(raf)
      trail.forEach((d) => d.remove())
    }
  }, [prefersReduced])

  /* Hero parallax — mouse drives a CSS variable that shifts the violet glow,
     so the bottom aurora subtly tracks the cursor (lerped for smoothness). */
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReduced) return
    /* Hero parallax is hover-only — skip on touch */
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return
    const el = heroRef.current
    if (!el) return
    let raf = 0
    let mx = 0, my = 0, tx = 0, ty = 0
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      tx = lerp(tx, mx, 0.08)
      ty = lerp(ty, my, 0.08)
      el.style.setProperty('--mx', tx.toFixed(3))
      el.style.setProperty('--my', ty.toFixed(3))
      raf = requestAnimationFrame(tick)
    }
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    el.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      el.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [prefersReduced])

  return (
    <div className={styles.root}>
      <div className={styles.crosshair} ref={crosshairRef} aria-hidden />

      {/* ─────────── Top bar ─────────── */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span className={styles.brandMark}>Folio</span>
          <span className={styles.topBarMeta}>Vol. 01 · 2026</span>
        </div>
      </header>

      {/* ─────────── HERO ─────────── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroInner}>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
          >
            Ads &amp; video that <em>actually</em><br />scale your brand.
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeOut }}
          >
            A creative studio for personal brands and growing businesses —
            building <strong style={{ color: 'var(--cf-fg)' }}>scroll-stopping ad creative</strong> and{' '}
            <strong style={{ color: 'var(--cf-fg)' }}>video content</strong> that earns the click
            and moves the metric.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
          >
            <a href="#book" className={styles.btnPrimary}>book a call</a>
            <a href="#work" className={styles.btnSecondary}>Learn More</a>
          </motion.div>

          {/* Trust stat strip — Real numbers from main site's STATS_EXTENDED */}
          <motion.div
            className={styles.heroTrust}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
          >
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustNum}>4.9<span>★</span></span>
              <span className={styles.heroTrustLabel}>Google Rating</span>
            </div>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustNum}>187<span>+</span></span>
              <span className={styles.heroTrustLabel}>Brands Scaled</span>
            </div>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustNum}>10K<span>+</span></span>
              <span className={styles.heroTrustLabel}>Campaigns Live</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom scroll indicator — pulses down to invite the user */}
        <span className={styles.scrollHint} aria-hidden>
          Scroll
          <span className={styles.scrollHintLine} />
        </span>
      </section>

      {/* ─────────── Capabilities marquee — 2 rows, infinite scroll ─────────── */}
      <section className={styles.capStrip} aria-label="Capabilities and industries">
        <p className={styles.capLabel}>
          Everything we ship &middot; <em>built in-house.</em>
        </p>
        {/* Row 1 — services (doubled track for seamless loop) */}
        <div className={styles.capRow}>
          {[...CAPABILITIES, ...CAPABILITIES].map((c, i) => (
            <span key={`cap-${i}`} className={`${styles.capPill} ${styles.capPillAccent}`}>
              {c}
            </span>
          ))}
        </div>
        {/* Row 2 — industries served, scrolling the other way */}
        <div className={styles.capRow}>
          {[...INDUSTRIES, ...INDUSTRIES].map((c, i) => (
            <span key={`ind-${i}`} className={styles.capPill}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────── Brand statement ─────────── */}
      <section className={styles.sectionHead}>
        <motion.p
          style={{
            fontFamily: 'var(--font-display), serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(20px, 2vw, 28px)',
            lineHeight: 1.5,
            color: 'var(--cf-fg)',
            maxWidth: 760,
            margin: '0 auto 32px',
          }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          I create thumb-stopping creative — reels, ads &amp; short-form video built
          to hook in the first three seconds and convert in the next thirty.
          No template briefs, no safe copy — just work that earns the scroll-stop,
          the click, and the sale.
        </motion.p>
        <a href="#work" className={styles.btnPrimary}>see the work</a>
      </section>

      {/* ─────────── Short-form & ad creative (4-col of 9:16) — shown first ─────────── */}
      <div id="work" className={styles.sectionHead}>
        <span className={styles.tag}>Short-form &amp; Ad Creative</span>
        <h2 className={styles.sectionTitle}>
          Reels, Shorts &amp; ad <em>creative.</em>
        </h2>
        <p className={styles.sectionSub}>
          Vertical video for paid &amp; organic — Meta, Google, YouTube Shorts, TikTok &amp; Reels.
          Hooks built for retention, ends built for the action.
        </p>
      </div>
      {/* Filter tabs — All / Reels / Shorts / Ad Creative */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Filter short-form work">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={activeTab === t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              <span className={styles.tabCount}>{bucketCounts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.shortGrid}>
        {filteredShortForm.map((w, i) => {
          const media = w.composition.media
          return (
            <WorkCard
              key={w.id}
              work={w}
              aspect="9/16"
              index={i}
              platform={SHORT_FORM_PLATFORMS[w.id]}
              onClick={media ? () => setLightbox({
                src: media.src,
                type: media.type,
                title: w.client,
                caption: w.title,
              }) : undefined}
            />
          )
        })}
      </div>

      {/* ─────────── Manifesto / transition band — bridges video → static ─────────── */}
      <section className={styles.manifesto} aria-label="Manifesto">
        <div className={styles.manifestoInner}>
          <motion.span
            className={styles.manifestoEyebrow}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            How we think
          </motion.span>
          <motion.p
            className={styles.manifestoQuote}
            initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, delay: 0.08, ease: easeOut }}
          >
            Every reel is built to <em>hook.</em> Every still is built to <em>click.</em>
          </motion.p>
          <motion.span
            className={styles.manifestoBy}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: easeOut }}
          >
            The Studio Manifesto
          </motion.span>
        </div>
      </section>

      {/* ─────────── Image gallery — bento layout, real studio output ─────────── */}
      <section className={styles.galleryBlock}>
        <div className={styles.sectionHead} style={{ padding: '0 0 clamp(40px, 5vw, 60px)', maxWidth: 760, margin: '0 auto' }}>
          <motion.span
            className={styles.tag}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}
          >
            From the studio
          </motion.span>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.05, ease: easeOut }}
          >
            Static creative that <em>clicks.</em>
          </motion.h2>
          <motion.p
            className={styles.sectionSub}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOut }}
          >
            Landing pages, social posts &amp; static ad creative — single-frame work
            that earns the click before a video even loads.
          </motion.p>
        </div>
        <div className={styles.galleryGrid}>
          {GALLERY.map((g, i) => (
            <motion.a
              key={g.src}
              className={styles.galleryItem}
              aria-label={`${g.client} — ${g.category}`}
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.75,
                delay: i * 0.10,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.client} className={styles.galleryImg} loading="lazy" />
              <span className={styles.galleryBadge}>
                <span className={styles.galleryBadgeDot} aria-hidden />
                {g.badge}
              </span>
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryClient}>{g.client}</span>
                <span className={styles.galleryCategory}>{g.category}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ─────────── Impact Numbers — dark band, count-up stats (2-up) ─────────── */}
      <section className={styles.impact}>
        <div className={styles.impactInner}>
          <div className={styles.impactHead}>
            <span className={styles.tag}>By the numbers</span>
            <h2 className={styles.impactTitle}>
              Creative that moves <em>real numbers.</em>
            </h2>
          </div>
          <div className={styles.impactGrid}>
            {IMPACT_STATS.map((s) => (
              <div key={s.label} className={styles.impactCell}>
                <div className={styles.impactNum}>
                  <CountUp end={s.num} suffix={s.suffix} />
                </div>
                <p className={styles.impactLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Services — Creative Ads + Video Editing ─────────── */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHead} style={{ padding: '0 0 32px' }}>
          <span className={styles.tag}>What we do</span>
          <h2 className={styles.sectionTitle}>
            Two services, one <em>focus</em> — outcomes.
          </h2>
          <p className={styles.sectionSub}>
            Performance ad creative and high-retention video — paired so each one feeds the other.
          </p>
        </div>
        <div className={styles.servicesGrid}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: easeOut }}
            >
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceBody}>{s.body}</p>
              <ul className={styles.serviceBullets}>
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div className={styles.serviceTags}>
                {s.tags.map((t) => (
                  <span key={t} className={styles.serviceTag}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────── Testimonials — centered header + horizontal carousel ─────────── */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsHeader}>
          <span className={styles.tag}>Client&rsquo;s Words</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: 18 }}>
            Hear it directly from <em>our clients.</em>
          </h2>
          <p className={styles.sectionSub}>
            What real clients have to say. The reviews reflect the satisfaction in our work.
          </p>
        </div>

        <div className={styles.carouselOuter}>
          <div className={styles.carouselTrack} ref={carouselRef} aria-label="Client testimonials">
            {TESTIMONIALS.map((t) => {
              const hasYt = Boolean(t.youtubeId)
              const openYt = hasYt
                ? () => setLightbox({
                    type: 'youtube',
                    src: t.youtubeId!,
                    title: t.name,
                    caption: t.role,
                    isShort: t.isShort,
                  })
                : undefined
              return (
                <motion.article
                  key={t.name}
                  className={styles.bigCard}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, ease: easeOut }}
                >
                  <div className={styles.bigCardCopy}>
                    <p className={styles.bigQuote}>{t.quote}</p>
                    <div>
                      <div className={styles.bigName}>{t.name}</div>
                      <div className={styles.bigRole}>{t.role}</div>
                    </div>
                  </div>
                  <div
                    className={styles.bigVideo}
                    style={{
                      background: t.gradient,
                      ...(hasYt ? { cursor: 'pointer' } : null),
                    }}
                    onClick={openYt}
                    onKeyDown={hasYt ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openYt!() }
                    } : undefined}
                    role={hasYt ? 'button' : undefined}
                    tabIndex={hasYt ? 0 : undefined}
                    aria-label={hasYt ? `Play ${t.name}'s video testimonial` : undefined}
                  >
                    {hasYt ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://i.ytimg.com/vi/${t.youtubeId}/hqdefault.jpg`}
                        alt={`${t.name} video testimonial`}
                        className={styles.bigVideoThumb}
                      />
                    ) : (
                      <span className={styles.bigVideoInitials}>{t.name[0]}</span>
                    )}
                    <span className={styles.bigVideoPlay}>
                      <Play size={22} fill="currentColor" strokeWidth={0} style={{ marginLeft: 3 }} />
                    </span>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className={styles.carouselNext}
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* ─────────── Final CTA ─────────── */}
      <section id="book" className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <span className={styles.tag} style={{ marginBottom: 22, display: 'inline-flex' }}>Let&rsquo;s talk</span>
          <h2 className={styles.sectionTitle} style={{ marginTop: 12 }}>
            Like the work? <em>Let&rsquo;s talk.</em>
          </h2>
          <p className={styles.sectionSub} style={{ marginBottom: 32 }}>
            One brief, one call, one decision. We&rsquo;ll come back within 24 hours.
          </p>
          <a
            href="mailto:hello@example.com?subject=Creative%20brief"
            className={styles.btnPrimary}
            style={{ gap: 8 }}
          >
            Send a brief <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* ─────────── Lightbox — only mounted when a card has been clicked ─────────── */}
      {lightbox && (
        <VideoModal
          src={lightbox.src}
          type={lightbox.type}
          title={lightbox.title}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}
