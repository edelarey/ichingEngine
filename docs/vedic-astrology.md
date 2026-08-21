# Jyotish (Vedic Astrology) — iChing Engine guide

This is the same tradition explained in the in-app help at `/vedic_help`. Sanskrit names are always paired with English: **Sūrya (Sun)**, **Meṣa (Aries)**, **Lagna (Ascendant)**.

## What Jyotish is

Jyotiṣa (“science of light”) is the classical Indian system for reading the sky at birth. The natal chart is a **Janma Kuṇḍalī**.

Western tropical astrology starts Aries at the spring equinox. Jyotish uses the **sidereal (nirayana) zodiac** locked to the fixed stars. The gap is the **ayanāṁśa** (~24° in the 2020s).

This app uses **Lahiri / Chitrāpakṣa** ayanāṁśa (Government of India standard; star Chitrā / Spica at 0° Libra):

```
sidereal longitude = tropical longitude − ayanāṁśa  (wrap at 360°)
```

## Nine grahas (planets)

| Sanskrit | English | Role (kāraka) |
|---|---|---|
| Sūrya | Sun | Soul, father, authority |
| Chandra | Moon | Mind, mother, emotions |
| Maṅgala | Mars | Energy, siblings, courage |
| Budha | Mercury | Intellect, speech |
| Guru | Jupiter | Wisdom, children, dharma |
| Śukra | Venus | Love, arts, comfort |
| Śani | Saturn | Karma, delay, longevity |
| Rāhu | North node | Obsession, foreign, eclipse |
| Ketu | South node | Detachment, moksha, past |

No Uranus, Neptune, or Pluto. Rāhu is the **mean** lunar node; Ketu = Rāhu + 180°.

## Twelve rāśis (signs)

Meṣa (Aries) … Mīna (Pisces), 30° each, sidereal. Lords: Mars (Aries, Scorpio), Venus (Taurus, Libra), Mercury (Gemini, Virgo), Moon (Cancer), Sun (Leo), Jupiter (Sagittarius, Pisces), Saturn (Capricorn, Aquarius).

## Whole-sign houses (bhāvas)

The sign containing the **Lagna (Ascendant)** is house 1. The next sign is house 2, and so on.

1. Lagna / Tanu — Self, body  
2. Dhana — Wealth, speech, family  
3. Sahaja — Siblings, courage  
4. Sukha — Home, mother  
5. Putra — Children, intelligence  
6. Ripu / Roga — Enemies, disease, service  
7. Kalatra — Marriage, partnership  
8. Āyur — Longevity, transformation  
9. Dharma — Fortune, father, guru  
10. Karma — Career, status  
11. Lābha — Gains, friends  
12. Vyaya — Loss, moksha, foreign  

Kendra (angular): 1, 4, 7, 10. Trikona (trinal): 1, 5, 9. Dusthāna: 6, 8, 12.

## How the chart is drawn

**North Indian (Bhṛgu chakra):** houses stay put. House 1 is always the top diamond; houses count counter-clockwise. Numbers 1–12 inside cells are rāśis (1 = Aries).

**South Indian (Guru chakra):** signs stay put. Pisces top-left, Aries next, clockwise. Lagna cell marked with a diagonal. Houses count clockwise from that sign.

Both formats encode the same data.

## Nakshatras and Vimśottarī daśā

27 lunar mansions of 13°20′, each with 4 pādas of 3°20′. The Moon’s nakshatra at birth (*janma nakshatra*) starts the 120-year Vimśottarī clock.

Order and years: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rāhu 18, Jupiter 16, Saturn 19, Mercury 17.

## Dignity and dṛṣṭi (aspects)

Dignity: exaltation → mūlatrikoṇa → own sign → friend → neutral → enemy → debilitation.

Every graha aspects the 7th house from itself. Extra: Mars 4 & 8; Jupiter 5 & 9; Saturn 3 & 10; Rāhu/Ketu 5, 7, 9 (labelled as modern practice).

## Using this app

1. Open `/vedic_astrology` or **Astrology → Vedic Astrology** in the sidebar.
2. Optionally load a saved birthday, or enter name, date, time, coordinates, and the **timezone of the birth place**.
3. Calculate. Toggle North Indian / South Indian drawings of the same kuṇḍalī.
4. Read Lagna (Ascendant), Chandra (Moon), Sūrya (Sun), graha dignity, twelve bhāvas, and the current Vimśottarī daśā.
5. Use **Vedic Help** (`/vedic_help`) for the tradition notes, or export a PDF from the chart tab.

Timezone matters: Lagna changes about every two hours. Saved birthdays without an offset will warn you to confirm the zone.

## What this version does not do

Divisional charts (D-9 Navamśa), yogas, transits, Ashtakoota matching, KP/Raman ayanāṁśa, Swiss Ephemeris-grade minutes. Positions are VSOP87 / Meeus natal-grade, not JPL.
