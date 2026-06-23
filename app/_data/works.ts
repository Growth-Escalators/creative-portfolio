export type WorkVariant = 'initial' | 'mark' | 'field' | 'poster' | 'spec' | 'media'
export type WorkBucket = 'reels' | 'shorts' | 'ads'

export type Work = {
  id: string
  client: string
  title: string
  category: string
  year: string
  variant: WorkVariant
  palette: {
    bg: string
    fg: string
    accent: string
  }
  composition: {
    initial?: string
    mark?: 'orbit' | 'arch' | 'split' | 'rule' | 'eclipse'
    fieldLines?: string[]
    posterStack?: string[]
    specRows?: { k: string; v: string }[]
    /** Real video or image. Files live under /public/media/. */
    media?: { type: 'video' | 'image'; src: string }
  }
  shortTag: string
  /** Which short-form filter bucket this belongs to (reels / shorts / ads). */
  bucket?: WorkBucket
  featured?: { col: number; row: number }
}

/* Real client wins — names + metrics pulled from main growthescalators.com data.
   Media (video/image) sourced from the studio's Video content + photot content folders. */
export const WORKS: Work[] = [
  /* ── Featured (4 cards, 2×2 long-form grid) ── */
  {
    id: 'paraiso-comfortwears',
    client: 'Paraiso Comfortwears',
    title: '₹33k → ₹3.4L sales in 30 days',
    category: 'Performance + Social',
    shortTag: 'PERFORMANCE',
    year: '2024',
    variant: 'media',
    palette: { bg: '#1a0a2e', fg: '#f5f1ea', accent: '#a855f7' },
    composition: {
      media: { type: 'video', src: '/media/ad-creative.mp4' },
    },
    featured: { col: 2, row: 2 },
  },
  {
    id: 'dr-dheeraj-dubay',
    client: 'Dr. Dheeraj Dubay',
    title: '35,000+ leads · Forbes record holder',
    category: 'Healthcare · Personal Brand',
    shortTag: 'HEALTHCARE',
    year: '2024',
    variant: 'media',
    palette: { bg: '#0a2a6e', fg: '#f5f1ea', accent: '#7ad7ff' },
    composition: {
      media: { type: 'video', src: '/media/orthopedic.mp4' },
    },
    featured: { col: 1, row: 2 },
  },
  {
    id: 'elixzor-media',
    client: 'Elixzor Media',
    title: '₹3.2Cr revenue at 10× ROAS',
    category: 'YouTube · USA',
    shortTag: 'YOUTUBE',
    year: '2024',
    variant: 'media',
    palette: { bg: '#1a0533', fg: '#f5f1ea', accent: '#a78bfa' },
    composition: {
      media: { type: 'video', src: '/media/cashcow.mp4' },
    },
    featured: { col: 1, row: 1 },
  },
  {
    id: 'odra-organics',
    client: 'Odra Organics',
    title: '20M+ Instagram reach',
    category: 'Wellness · Social',
    shortTag: 'SOCIAL',
    year: '2024',
    variant: 'media',
    palette: { bg: '#166534', fg: '#f5f1ea', accent: '#4ade80' },
    composition: {
      media: { type: 'image', src: '/media/odra-glow.png' },
    },
    featured: { col: 1, row: 1 },
  },

  /* ── Catalogue (8 cards, 9:16 short-form grid) ── */
  {
    id: 'flight-ticket-fare',
    client: 'Flight Ticket Fare',
    title: 'CPL dropped 75%',
    category: 'Travel · Funnel',
    shortTag: 'FUNNEL',
    year: '2024',
    variant: 'media',
    bucket: 'shorts',
    palette: { bg: '#0d1330', fg: '#dde9ff', accent: '#7ad7ff' },
    composition: {
      media: { type: 'video', src: '/media/destination.mp4' },
    },
  },
  {
    id: 'exzept',
    client: 'Exzept',
    title: 'Revenue +₹8L in 90 days',
    category: 'D2C Fashion',
    shortTag: 'D2C',
    year: '2024',
    variant: 'media',
    bucket: 'ads',
    palette: { bg: '#1a1a2e', fg: '#f5f1ea', accent: '#FF6B35' },
    composition: {
      media: { type: 'video', src: '/media/product-ad.mp4' },
    },
  },
  {
    id: 'credo-world',
    client: 'Credo World',
    title: '15 B2B leads / month from zero',
    category: 'B2B · Consulting',
    shortTag: 'B2B',
    year: '2024',
    variant: 'media',
    bucket: 'ads',
    palette: { bg: '#2d1500', fg: '#f5f1ea', accent: '#ff9554' },
    composition: {
      media: { type: 'video', src: '/media/promo.mp4' },
    },
  },
  {
    id: 'sn-herbals',
    client: 'SN Herbals',
    title: 'Shopify store + paid ads launched',
    category: 'Ayurveda · E-Commerce',
    shortTag: 'COMMERCE',
    year: '2024',
    variant: 'media',
    bucket: 'ads',
    palette: { bg: '#0f3020', fg: '#dffbe4', accent: '#22c55e' },
    composition: {
      media: { type: 'image', src: '/media/odra-formula.png' },
    },
  },
  {
    id: 'gentle-panda',
    client: 'Gentle Panda',
    title: 'Brand consultancy + GTM',
    category: 'Baby · Kids',
    shortTag: 'CONSULT',
    year: '2024',
    variant: 'media',
    bucket: 'reels',
    palette: { bg: '#0c1a2e', fg: '#dbeafe', accent: '#3b82f6' },
    composition: {
      media: { type: 'image', src: '/media/studio.jpg' },
    },
  },
  {
    id: 'atatica-studios',
    client: 'Atatica Studios',
    title: 'Full portfolio site live',
    category: 'Entertainment · Web',
    shortTag: 'WEB',
    year: '2024',
    variant: 'media',
    bucket: 'shorts',
    palette: { bg: '#0d0d0d', fg: '#e2dffc', accent: '#a78bfa' },
    composition: {
      media: { type: 'video', src: '/media/visualizer.mp4' },
    },
  },

  /* Redistributed to fill 4-per-bucket — Reels / Shorts / Ad Creative all = 4 */
  {
    id: 'dr-dheeraj-dubay',
    client: 'Dr. Dheeraj Dubay',
    title: '35,000+ leads · Forbes record',
    category: 'Healthcare · Personal Brand',
    shortTag: 'HEALTHCARE',
    year: '2024',
    variant: 'media',
    bucket: 'reels',
    palette: { bg: '#0a2a6e', fg: '#f5f1ea', accent: '#7ad7ff' },
    composition: {
      media: { type: 'video', src: '/media/orthopedic.mp4' },
    },
  },
  {
    id: 'swarnsootra',
    client: 'Swarnsootra',
    title: 'Wedding jewelry campaign',
    category: 'Jewelry · Lifestyle',
    shortTag: 'JEWELRY',
    year: '2024',
    variant: 'media',
    bucket: 'reels',
    palette: { bg: '#1f1207', fg: '#fde7c8', accent: '#FFC83D' },
    composition: {
      media: { type: 'image', src: '/media/wedd-1.png' },
    },
  },
  {
    id: 'dr-shubham',
    client: 'Dr. Shubham',
    title: 'Personal brand reel · healthcare',
    category: 'Healthcare · Personal Brand',
    shortTag: 'PERSONAL',
    year: '2024',
    variant: 'media',
    bucket: 'reels',
    palette: { bg: '#3a0f1a', fg: '#f9eadd', accent: '#ff8aa6' },
    composition: {
      media: { type: 'video', src: '/media/personal-brand.mp4' },
    },
  },
  {
    id: 'elixzor-media',
    client: 'Elixzor Media',
    title: '₹3.2Cr revenue · 10× ROAS',
    category: 'YouTube · USA',
    shortTag: 'YOUTUBE',
    year: '2024',
    variant: 'media',
    bucket: 'shorts',
    palette: { bg: '#1a0533', fg: '#f5f1ea', accent: '#a78bfa' },
    composition: {
      media: { type: 'video', src: '/media/cashcow.mp4' },
    },
  },
  {
    id: 'real-estate-brand',
    client: 'Real Estate Brand',
    title: 'Premium property reel',
    category: 'Real Estate · Lifestyle',
    shortTag: 'REAL ESTATE',
    year: '2024',
    variant: 'media',
    bucket: 'shorts',
    palette: { bg: '#1f1207', fg: '#fde7c8', accent: '#FF6B35' },
    composition: {
      media: { type: 'video', src: '/media/real-estate.mp4' },
    },
  },
  {
    id: 'paraiso-comfortwears',
    client: 'Paraiso Comfortwears',
    title: '₹33k → ₹3.4L · 30 days',
    category: 'D2C · Performance',
    shortTag: 'D2C',
    year: '2024',
    variant: 'media',
    bucket: 'ads',
    palette: { bg: '#1a0a2e', fg: '#f5f1ea', accent: '#a855f7' },
    composition: {
      media: { type: 'video', src: '/media/ad-creative.mp4' },
    },
  },
]

/** Distinct category tags for the marquee strip. */
export const CATEGORIES = [
  'PERFORMANCE',
  'PERSONAL BRAND',
  'B2B',
  'D2C',
  'YOUTUBE',
  'WEB',
  'BRAND IDENTITY',
  'SOCIAL',
]
