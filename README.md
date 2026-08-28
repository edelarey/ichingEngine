# iChing Engine

Live: **[https://iching-engine.vercel.app/](https://iching-engine.vercel.app/)**

A Vue 3 app for the **I Ching (Yijing, Book of Changes)** and three natal systems from one birthday list:

- Coin / yarrow-style **oracle** (64 hexagrams, changing lines)
- **I-Ching astrology** after Sherrill & Chu (*The Astrology of I Ching*, 1976) — not BaZi, not the coin oracle — plus **I-Ching Daily** hexagrams
- **Jyotish** (sidereal, Lahiri, whole-sign houses, Vimśottarī daśā) plus **Vedic Daily** gochara
- **Western** tropical natal charts (astronomia VSOP87 / Meeus; true Ascendant) plus **Western Daily** transits

Licensed **AGPL-3.0**. See [LICENSE](LICENSE). Readings are educational, not medical, legal, or financial advice.

## Setup

```
npm install
npm run serve
```

Runs at `http://localhost:8080/`. Production: `npm run build`. Fixture checks: `npm test`.

## Routes

| Section | Route | Notes |
|---|---|---|
| Consult | `/consult` | Coin or yarrow-style hexagram; history export/import |
| Birthdays | `/birthdays` | Add/edit people; place search fills coordinates and timezone |
| I-Ching Astrology | `/astrology` | Pre-Heaven / Later-Heaven, controlling line, sexagenary year/month/day, life stages, PDF |
| I-Ching Daily | `/daily_reading` | Independent early-life and later-life daily hexagrams for a saved birthday |
| Vedic | `/vedic_astrology` | Sidereal kundli, North/South Indian chart, grahas, daśā |
| Vedic Daily | `/vedic_daily` | Natal plus gochara for a chosen day; daśā chapter, Chandra navatāra, Guru/Śani frame |
| Jyotish guide | `/vedic_help` | How the Vedic chart is drawn and read |
| Western | `/western_astrology` | Tropical natal, houses, aspects, transits, PDF |
| Western Daily | `/western_daily` | Natal plus transits for a chosen day; Moon-led lead, Saturn/Jupiter month strip |
| Compare | `/compare` | Same person, three executive summaries |
| Relationship | `/relationship` | Two people × I-Ching, Vedic, Western compatibility, PDF |
| Trigrams | `/trigrams` | Eight bagua |
| Hexagrams | `/hexagrams` | 64 hexagrams, search and King Wen / binary / name order |
| Sequences | `/hexagram_sequence` | King Wen, Fu Xi, Grey code, Shao Yong, consultation history |
| Life Symphony | `/life_symphony` | Tone.js reading from a birth hexagram |
| Solfeggio | `/solfeggio` | Solfeggio player |
| Hexagram Studio | `/hexagram_studio` | Play cast hexagrams or a Life Symphony as line-rhythm, Roche scale, solfeggio, or Fibonacci durations |
| About | `/about` | What the engine is and is not |

Gender on birth records is **Male or Female** (I-Ching astrology uses that polarity). Vedic and Western charts also need **birth time, place, and timezone** for Lagna / Rising.

## Stack

Vue 3, Vue Router, Pinia (persisted birthdays), Bootstrap 5, Luxon, astronomia, Tone.js, jsPDF + DejaVu fonts.

Natal charts are astronomia-grade, not Swiss Ephemeris. I-Ching astrology is custom Ho Map math from the book above; there is no standard library to swap in.

## Search / deploy

Public site: `https://iching-engine.vercel.app/`.

Google and social crawlers read:

- **Title and description** per route: `src/const/seo.js` (applied in `src/App.vue`). The HTML fallback for the homepage is `public/index.html`.
- **Open Graph / Twitter** tags and `/og.png` for link previews.
- **JSON-LD** (`WebSite` + `WebApplication`) in `public/index.html` and on each client-rendered route.
- **Sitemap:** `public/sitemap.xml` (listed from `public/robots.txt`).
- **Google Search Console** file: `public/googleaf0181f89a0f0106.html` (do not edit; it is a verification token).

After deploy, ask Search Console to recrawl the sitemap if new routes were added (`/daily_reading`, `/western_daily`, `/vedic_daily`, `/hexagram_studio`).

## Changelog (recent)

- Shared birthday manager, place search, collapsible birth panel, compare view
- Vedic Jyotish section; Western rewrite on astronomia
- Relationship compatibility across I-Ching, Vedic, and Western; shared PDF layout
- I-Ching astrology single-page reading (no nine tabs); catalog pages for trigrams, hexagrams, sequences
- I-Ching Daily: independent early-life and later-life daily hexagrams from the last selected birthday
- Western Daily: natal plus transits for a chosen day (Moon-led; Saturn and Jupiter frame the month)
- Vedic Daily: natal plus gochara for a chosen day (Vimśottarī daśā; Chandra navatāra; Guru and Śani frame the month)
- Life Symphony and Solfeggio players
- Hexagram Studio: cast readings and Life Symphony years as Uakti rhythm, Roche scale, solfeggio, or Fibonacci durations
- Plain-English executive summaries on natal pages
- Search metadata: per-route titles, descriptions, Open Graph, JSON-LD, sitemap
