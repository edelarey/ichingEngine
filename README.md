# iChing Engine

Online **I Ching (Yijing)** oracle with **I-Ching astrology**, **Vedic Jyotish** natal charts, and **Western** tropical natal charts. One saved birthday list feeds all three.

Licensed **AGPL-3.0**. See [LICENSE](LICENSE).

## Setup

```
npm install
npm run serve
```

Production build: `npm run build`. Fixture checks: `npm test`.

## What it does

| Section | Route | Notes |
|---|---|---|
| Consult | `/consult` | Coin-style I Ching hexagram reading |
| Birthdays | `/birthdays` | Add/edit people; place search fills coordinates and timezone |
| I-Ching Astrology | `/astrology` | Sexagenary cycles, pre-/later-heaven hexagrams |
| Vedic | `/vedic_astrology` | Sidereal kundli, Lahiri, North/South Indian charts, daśā |
| Western | `/western_astrology` | Tropical natal, true Rising, Placidus, aspects, transits |
| Compare | `/compare` | Same person, three executive summaries |
| Jyotish guide | `/vedic_help` | How the Vedic chart is drawn and read |
| Relationships | `/relationship` | I-Ching compatibility using two saved birthdays |

Gender on birth records is **male or female** (used by I-Ching astrology). Vedic and Western charts also need **birth time, place, and timezone** for an accurate Ascendant / Lagna.

Charts are natal-grade (astronomia VSOP87 / Meeus), not Swiss Ephemeris. Readings are educational, not medical, legal, or financial advice.

## Search / deploy

- Keywords and description: `public/index.html` and `src/App.vue`
- Sitemap: `public/sitemap.xml`
- Google Search Console file: `public/googleaf0181f89a0f0106.html` (do not edit; it is a verification token)

## Changelog (recent)

- Shared birthday page, place search, compare view
- Vedic Jyotish section; Western rewrite on astronomia
- Plain-English executive summaries
- I-Ching PDF; Western transits
