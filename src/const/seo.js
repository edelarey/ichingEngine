/**
 * Titles, descriptions, and structured data Google (and social crawlers) read.
 * Keep in sync with public/index.html, sitemap.xml, and the About page.
 */

export const SITE_ORIGIN = 'https://iching-engine.vercel.app';
export const SITE_NAME = 'iChing Engine';
export const SITE_TITLE = 'iChing Engine — Free I Ching Oracle, Vedic Jyotish & Western Astrology';
export const SITE_DESCRIPTION =
  'Free I Ching (Yijing) oracle: cast hexagrams, then read a birth in three systems — I-Ching astrology, Vedic Jyotish (kundli, Lahiri, daśā), and Western natal charts. Daily hexagrams, gochara, and transits from one birthday list.';
export const SITE_KEYWORDS = [
  'I Ching',
  'iChing',
  'Yijing',
  'Yi Jing',
  'Book of Changes',
  'I Ching oracle',
  'I Ching consultation',
  'hexagram',
  'trigram',
  'bagua',
  'I Ching daily',
  'I Ching astrology',
  'Sherrill Chu',
  'Pre-Heaven',
  'Later-Heaven',
  'Vedic astrology',
  'Jyotish',
  'kundli',
  'janma kundali',
  'Lahiri ayanamsa',
  'nakshatra',
  'Vimshottari dasha',
  'Lagna',
  'gochara',
  'Vedic daily',
  'Vedic transits',
  'Western astrology',
  'natal chart',
  'birth chart calculator',
  'rising sign',
  'ascendant',
  'Placidus',
  'Western transits',
  'Western daily horoscope natal',
  'tropical zodiac',
  'sidereal zodiac',
  'Chinese astrology',
  'sexagenary cycle',
  'relationship compatibility',
  'synastry',
  'online horoscope',
  'free natal chart',
].join(', ');

export const OG_IMAGE = `${SITE_ORIGIN}/og.png`;

const pages = {
  '/': {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  '/consult': {
    title: 'Consult the I Ching | iChing Engine',
    description:
      'Free online I Ching (Yijing) consultation. Cast a hexagram with coins or yarrow-style lines, read judgement, image, changing lines, and the transformed hexagram.',
  },
  '/birthdays': {
    title: 'Birthdays | iChing Engine',
    description:
      'Save birth data once — name, time, place, timezone — and reuse it for I-Ching, Vedic, and Western natal charts and daily readings.',
  },
  '/astrology': {
    title: 'I-Ching Astrology | iChing Engine',
    description:
      'I-Ching natal astrology after Sherrill & Chu: Pre-Heaven and Later-Heaven hexagrams, controlling line, sexagenary year, month, and day. Not BaZi, not the coin oracle.',
  },
  '/daily_reading': {
    title: 'I-Ching Daily | iChing Engine',
    description:
      'Daily I Ching hexagrams for a birth: independent early-life (Pre-Heaven) and later-life (Later-Heaven) readings for any date.',
  },
  '/vedic_astrology': {
    title: 'Vedic Astrology (Jyotish) | iChing Engine',
    description:
      'Free Vedic natal chart (janma kuṇḍalī): Lahiri sidereal zodiac, Lagna, whole-sign houses, nine grahas, nakshatra, and Vimśottarī daśā. North or South Indian chart.',
  },
  '/vedic_daily': {
    title: 'Vedic Daily | iChing Engine',
    description:
      'Vedic daily gochara for a natal chart. Vimśottarī daśā is the chapter; Chandra’s nakshatra (navatāra) leads the day; Guru and Śani frame the month.',
  },
  '/vedic_help': {
    title: 'Jyotish Guide | iChing Engine',
    description:
      'How this Jyotish engine draws a kundli: Lahiri ayanāṁśa, Lagna, whole-sign houses, dṛṣṭi, nakshatras, Vimśottarī daśā, and Vedic Daily gochara.',
  },
  '/western_astrology': {
    title: 'Western Astrology Natal Chart | iChing Engine',
    description:
      'Free Western natal chart: tropical zodiac, true Ascendant (Rising), Placidus houses, major aspects, and current transits. Astronomia VSOP87 / Meeus.',
  },
  '/western_daily': {
    title: 'Western Daily | iChing Engine',
    description:
      'Western daily transits to a natal chart. The Moon leads the day; Saturn and Jupiter frame the month. Not a Sun-sign horoscope.',
  },
  '/compare': {
    title: 'Compare Natal Readings | iChing Engine',
    description:
      'The same birth in three systems: I-Ching hexagrams, Vedic Jyotish, and a Western natal chart, side by side in plain English.',
  },
  '/relationship': {
    title: 'Relationship Compatibility | iChing Engine',
    description:
      'Two-person compatibility across I Ching hexagrams, Vedic Moon and Lagna, and Western synastry. Printable PDF.',
  },
  '/hexagrams': {
    title: '64 I Ching Hexagrams | iChing Engine',
    description:
      'All 64 I Ching (Yijing) hexagrams: names, judgements, images, and changing lines. Search King Wen, binary, or name order.',
  },
  '/hexagram_sequence': {
    title: 'I Ching Hexagram Sequences | iChing Engine',
    description:
      'I Ching hexagram sequences: King Wen, Fu Xi, Grey code, Shao Yong, and your consultation history.',
  },
  '/hexagram_detail': {
    title: 'Hexagram Detail | iChing Engine',
    description: 'Judgement, image, and line texts for an I Ching hexagram.',
  },
  '/trigrams': {
    title: 'I Ching Trigrams (Bagua) | iChing Engine',
    description:
      'The eight I Ching trigrams (bagua): Heaven, Earth, Thunder, Wind, Water, Fire, Mountain, Lake.',
  },
  '/trigram_detail': {
    title: 'Trigram Detail | iChing Engine',
    description: 'One of the eight I Ching trigrams (bagua) and its paired hexagrams.',
  },
  '/astrology_chart': {
    title: 'Chinese Zodiac Chart | iChing Engine',
    description: 'Chinese zodiac animals and the sexagenary cycle used with I-Ching astrology.',
  },
  '/iching_zodiac_chart': {
    title: 'Western Zodiac Chart | iChing Engine',
    description: 'Western tropical signs as used in the natal chart calculator.',
  },
  '/tibetan_mantra_chart': {
    title: 'Tibetan Mantra Chart | iChing Engine',
    description: 'Tibetan mantra chart related to the I Ching engine catalog.',
  },
  '/hexagram_studio': {
    title: 'Hexagram Studio | iChing Engine',
    description:
      'Hear I Ching hexagrams as sound: Uakti line-rhythm, Roche scale, solfeggio, or Fibonacci durations. Cast readings or a Life Symphony.',
  },
  '/life_symphony': {
    title: 'Life Symphony | iChing Engine',
    description: 'Play a Tone.js symphony from a birth hexagram year by year.',
  },
  '/solfeggio': {
    title: 'Solfeggio Player | iChing Engine',
    description: 'Solfeggio tone player paired with I Ching hexagram readings.',
  },
  '/about': {
    title: 'About iChing Engine | I Ching, Jyotish & Western Astrology',
    description:
      'What iChing Engine is: a free I Ching oracle plus I-Ching, Vedic, and Western natal charts and daily readings. Open source AGPL-3.0. Educational, not medical or legal advice.',
  },
};

export function pageSeo(path) {
  const clean = String(path || '/').split('?')[0].replace(/\/$/, '') || '/';
  const page = pages[clean] || {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  };
  const url = clean === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean}`;
  return {
    ...page,
    url,
    keywords: SITE_KEYWORDS,
    image: OG_IMAGE,
  };
}

export function jsonLdGraph(path = '/') {
  const seo = pageSeo(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        alternateName: ['易經引擎', 'Yijing Engine', 'iChingEngine'],
        url: `${SITE_ORIGIN}/`,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_ORIGIN}/#app` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_ORIGIN}/#app`,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: SITE_DESCRIPTION,
        featureList: [
          'I Ching (Yijing) coin and yarrow-style oracle',
          'I-Ching natal astrology and daily hexagrams',
          'Vedic Jyotish kundli, daśā, and daily gochara',
          'Western tropical natal chart and daily transits',
          'Relationship compatibility across three systems',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${seo.url}#webpage`,
        url: seo.url,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        inLanguage: 'en',
      },
    ],
  };
}

export function headTags(path) {
  const seo = pageSeo(path);
  return {
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'keywords', content: seo.keywords },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'author', content: SITE_NAME },
      { name: 'application-name', content: SITE_NAME },
      { name: 'theme-color', content: '#3f41c2' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:url', content: seo.url },
      { property: 'og:image', content: seo.image },
      { property: 'og:image:alt', content: `${SITE_NAME} — I Ching hexagram` },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: seo.image },
    ],
    link: [{ rel: 'canonical', href: seo.url }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLdGraph(path)),
      },
    ],
  };
}
