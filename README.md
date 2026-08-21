# ichingengine

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

- You can view the full license text in the [LICENSE](LICENSE) file.
- Official license page: https://www.gnu.org/licenses/agpl-3.0.html

In short: You are free to use, modify, and share the code (including commercially), but:
- Any modifications or derivative works must also be licensed under AGPL-3.0 (or compatible).
- If you run a modified version on a server and users interact with it over a network, you must provide them the source code (including your changes).
  
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### Added Google Verification File
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Vedic Astrology (Jyotish)

The app now includes a **Vedic Astrology** section at `/vedic_astrology` (sidebar: Astrology → Vedic Astrology).

- Sidereal natal chart (Janma Kuṇḍalī) with **Lahiri / Chitrāpakṣa** ayanāṁśa
- Nine grahas: Sūrya (Sun) through Śani (Saturn), plus mean Rāhu and Ketu
- Whole-sign houses from Lagna (Ascendant)
- North Indian (Bhṛgu) diamond chart and South Indian (Guru) square chart
- Nakshatras, dignity, dṛṣṭi (aspects), and Vimśottarī daśā
- Rule-based interpretations; bilingual Sanskrit (English) labels throughout
- PDF export; reuses the shared birthday history
- Tradition guide: `/vedic_help` and `docs/vedic-astrology.md`

Birth **time and timezone of the birth place** are required for an accurate Lagna. Positions are natal-grade (astronomia VSOP87 / Meeus), not Swiss Ephemeris.

## Western Astrology

`/western_astrology` now uses the **same tropical ephemeris** as Vedic (astronomia VSOP87 / Meeus), then keeps the tropical zodiac instead of subtracting Lahiri.

- True **Ascendant (Rising)** and **Midheaven**, not a copy of the Sun sign
- **Placidus** houses (Equal fallback at high latitude, or choose Equal)
- Major **aspects** with orbs, drawn on the wheel (Ascendant on the left)
- Retrograde, essential dignity, Sun / Moon / Rising interpretations
- Timezone of the birth place (same birthday list as Vedic)

# Enhance Relationship Compatibility
# New Added Relationship Compatibility 
# fix date handling
# change to tab layout for Astrology
# Add astrological images (Summary Only)
# Add Zodiac Charts - Chinese and Western correspondence to IChing
# Tweak Charts Layout
# Add Tibetan Hum Mantra Visualization
# Add Analytics 
# Add google verification and sitemap
# Update hexagram list
# Update Birthday Handling
# Add western astrology section
# Add Western Atrology PDF Export
# Revert to original layouts
# Add Solfeggio Frequency Player
# Add basic Life Symphony
# Redeploy
# Fix Pico Vulnerablity
# Add Vedic Astrology section (Jyotish kundli, Lahiri, North/South Indian charts, interpretations, help)
# Rewrite Western astrology on astronomia (true ASC, Placidus, aspects, timezone)
