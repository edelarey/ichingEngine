<template>
  <div class="vedic-help-page">
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Jyotish Guide (Vedic Astrology)</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item"><router-link to="/vedic_astrology">Vedic Astrology</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">Guide</li>
          </ol>
        </nav>
      </div>
    </header>

    <div class="container mb-5 help-body">
      <p class="lead">
        Jyotish (Sanskrit: Jyotiṣa, “science of light”) is the classical Indian system for reading the sky at birth.
        This app casts a Janma Kuṇḍalī (natal chart) with bilingual labels: Sanskrit first, English in parentheses —
        e.g. Sūrya (Sun), Meṣa (Aries), Lagna (Ascendant).
      </p>
      <p>
        <router-link to="/vedic_astrology" class="btn btn-dark btn-sm">Open the Vedic chart tool</router-link>
      </p>

      <section>
        <h2>Sidereal zodiac (Nirayana), not tropical</h2>
        <p>
          Western tropical astrology starts Aries at the spring equinox. Jyotish locks the signs to the
          <strong>fixed stars</strong>. The gap is the <strong>ayanāṁśa</strong> (precession offset), about 24° in the 2020s.
        </p>
        <p>
          This engine uses <strong>Lahiri / Chitrāpakṣa</strong> ayanāṁśa, the Government of India standard
          (star Chitrā / Spica at 0° Libra). Formula used in the app:
        </p>
        <pre>sidereal longitude = tropical longitude − ayanāṁśa  (wrap at 360°)</pre>
      </section>

      <section>
        <h2>Nine grahas (planets)</h2>
        <p>
          Classical Jyotish uses seven visible bodies plus the lunar nodes. Uranus, Neptune, and Pluto are omitted.
        </p>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr><th>Sanskrit</th><th>English</th><th>Glyph</th><th>Kāraka (significator)</th></tr>
            </thead>
            <tbody>
              <tr><td>Sūrya</td><td>Sun</td><td>☉</td><td>Soul, father, authority, vitality</td></tr>
              <tr><td>Chandra</td><td>Moon</td><td>☽</td><td>Mind, mother, emotions, the public</td></tr>
              <tr><td>Maṅgala</td><td>Mars</td><td>♂</td><td>Energy, siblings, courage, conflict</td></tr>
              <tr><td>Budha</td><td>Mercury</td><td>☿</td><td>Intellect, speech, trade, skill</td></tr>
              <tr><td>Guru</td><td>Jupiter</td><td>♃</td><td>Wisdom, children, dharma, teachers</td></tr>
              <tr><td>Śukra</td><td>Venus</td><td>♀</td><td>Love, arts, comfort, spouse (for men)</td></tr>
              <tr><td>Śani</td><td>Saturn</td><td>♄</td><td>Karma, delay, longevity, labour</td></tr>
              <tr><td>Rāhu</td><td>North node</td><td>☊</td><td>Obsession, foreign, unconventional desire</td></tr>
              <tr><td>Ketu</td><td>South node</td><td>☋</td><td>Detachment, moksha, past skill</td></tr>
            </tbody>
          </table>
        </div>
        <p class="small text-muted">
          Rāhu and Ketu are the mean lunar nodes (not the true node). Ketu is always Rāhu + 180°.
          Both are treated as Vakṛ (retrograde) by convention.
        </p>
      </section>

      <section>
        <h2>Twelve rāśis (signs)</h2>
        <p>
          Same twelve signs as the West, counted sidereally. 1 Meṣa (Aries) … 12 Mīna (Pisces).
          Elements: Agni (Fire), Pṛthvī (Earth), Vāyu (Air), Jala (Water).
          Modalities: Chara (Movable), Sthira (Fixed), Dvisvabhāva (Dual).
        </p>
      </section>

      <section>
        <h2>Lagna (Ascendant) and whole-sign houses</h2>
        <p>
          The Lagna is the rāśi rising on the eastern horizon at birth. It changes about every two hours,
          so <strong>birth time and timezone of the birth place</strong> are required. This app does not
          guess the browser’s zone as the birth zone.
        </p>
        <p>
          Houses (bhāvas) are <strong>whole sign</strong>: the entire Lagna sign is house 1, the next sign house 2, and so on.
          There are no intercepted signs.
        </p>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr><th>#</th><th>Sanskrit</th><th>English</th><th>Life area</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Lagna / Tanu</td><td>Self / Body</td><td>Personality, vitality, appearance</td></tr>
              <tr><td>2</td><td>Dhana</td><td>Wealth / Speech</td><td>Family, money, voice</td></tr>
              <tr><td>3</td><td>Sahaja</td><td>Siblings / Courage</td><td>Effort, short travel, skills</td></tr>
              <tr><td>4</td><td>Sukha</td><td>Home / Mother</td><td>Property, inner peace, mother</td></tr>
              <tr><td>5</td><td>Putra</td><td>Children / Intelligence</td><td>Creativity, romance, mantra</td></tr>
              <tr><td>6</td><td>Ripu / Roga</td><td>Enemies / Disease</td><td>Service, debts, competition</td></tr>
              <tr><td>7</td><td>Kalatra</td><td>Partnership / Marriage</td><td>Spouse, contracts, the other</td></tr>
              <tr><td>8</td><td>Āyur</td><td>Longevity / Transformation</td><td>Shared resources, occult, crisis</td></tr>
              <tr><td>9</td><td>Dharma</td><td>Dharma / Fortune</td><td>Father, guru, luck, long travel</td></tr>
              <tr><td>10</td><td>Karma</td><td>Career / Status</td><td>Profession, public standing</td></tr>
              <tr><td>11</td><td>Lābha</td><td>Gains / Friends</td><td>Income, alliances, desires</td></tr>
              <tr><td>12</td><td>Vyaya</td><td>Loss / Liberation</td><td>Expenses, foreign, moksha</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Kendra (angular): 1, 4, 7, 10. Trikona (trinal): 1, 5, 9.
          Dusthāna (difficult): 6, 8, 12. Upachaya (growth): 3, 6, 10, 11.
        </p>
      </section>

      <section>
        <h2>How the two chart formats are drawn</h2>
        <h5>North Indian (Bhṛgu chakra) — houses fixed</h5>
        <p>
          Diamond grid. House 1 is always the top-center diamond. Houses count <strong>counter-clockwise</strong>.
          The number in each cell is the rāśi (1 = Aries … 12 = Pisces). Graha abbreviations sit in the house they occupy.
          Lagna’s cell is tinted gold and marked Lg.
        </p>
        <h5>South Indian (Guru chakra) — signs fixed</h5>
        <p>
          4×4 square, centre unused. Pisces is always top-left; signs run <strong>clockwise</strong>.
          The Lagna cell is marked with a diagonal and Lg. Houses rotate around that sign.
        </p>
        <p>Both drawings encode the same data. Toggle them on the chart page.</p>
        <p>
          Abbreviations: Su Sūrya (Sun), Mo Chandra (Moon), Ma Maṅgala (Mars), Me Budha (Mercury),
          Ju Guru (Jupiter), Ve Śukra (Venus), Sa Śani (Saturn), Ra Rāhu, Ke Ketu. R = Vakra (Retrograde).
        </p>
      </section>

      <section>
        <h2>Nakshatras (lunar mansions)</h2>
        <p>
          27 nakshatras of 13°20′ each, four pādas (quarters) of 3°20′. The Moon’s nakshatra at birth
          (janma nakshatra) describes temperament and starts the Vimśottarī daśā clock.
        </p>
      </section>

      <section>
        <h2>Dignity (how well a graha can act)</h2>
        <p>Strongest → weakest:</p>
        <ol>
          <li>Uccha (Exalted)</li>
          <li>Mūlatrikoṇa (Root trine)</li>
          <li>Svasthāna / Swakshetra (Own sign)</li>
          <li>Mitra-rāśi (Friend’s sign)</li>
          <li>Sama-rāśi (Neutral)</li>
          <li>Śatru-rāśi (Enemy’s sign)</li>
          <li>Nīcha (Debilitated)</li>
        </ol>
      </section>

      <section>
        <h2>Dṛṣṭi (aspects)</h2>
        <p>
          Whole-sign, no orbs. Every graha aspects the 7th house from itself.
          Maṅgala (Mars) also 4 and 8; Guru (Jupiter) also 5 and 9; Śani (Saturn) also 3 and 10;
          Rāhu/Ketu 5, 7, 9 (common modern practice, labelled as such).
        </p>
      </section>

      <section>
        <h2>Vimśottarī daśā (120-year planetary periods)</h2>
        <p>
          Starting mahādaśā (major period) = lord of the Moon’s nakshatra. Remaining fraction of that
          nakshatra becomes the leftover years of the first period. Order and years:
          Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rāhu 18, Jupiter 16, Saturn 19, Mercury 17.
        </p>
        <p>
          The chart page shows the current mahādaśā and antardaśā (sub-period) plus a compact timeline.
          This is educational timing, not a prediction engine.
        </p>
      </section>

      <section>
        <h2>How to read a chart in this app</h2>
        <ol>
          <li>Identify Lagna (Ascendant) and its lord — the foundation.</li>
          <li>Read Chandra rāśi (Moon sign) and janma nakshatra (birth lunar mansion).</li>
          <li>Read Sūrya rāśi (Sun sign) for soul/father/authority themes.</li>
          <li>Note graha dignity (exalted, own, debilitated, …).</li>
          <li>Walk the twelve bhāvas: occupants, lord placement, dṛṣṭi received.</li>
          <li>Check the current Vimśottarī mahādaśā / antardaśā for which themes are timed now.</li>
          <li>For a chosen day, open Vedic Daily: Chandra’s nakshatra (navatāra) and gochara against this chart.</li>
        </ol>
      </section>

      <section>
        <h2>Gochara (transits) and Vedic Daily</h2>
        <p>
          Jyotish times events with two clocks. <strong>Vimśottarī daśā</strong> is the chapter of life
          (mahādaśā / antardaśā). <strong>Gochara</strong> is the sky on a chosen day against the natal chart.
        </p>
        <p>
          The daily unit is Chandra (Moon): a nakshatra lasts about a day, a rāśi about two and a quarter.
          Counted from the janma nakshatra, that Moon is one of nine <strong>navatāra</strong>
          (Janma, Sampat, Vipat, Kṣema, Pratyari, Sādhaka, Naidhana, Mitra, Paramamitra).
          Guru and Śani barely move day to day; they frame the month and year. Sūrya names the solar month.
          Houses are whole-sign from Lagna and from the natal Moon. Aspects are classical dṛṣṭi, not Western orbs.
        </p>
        <p>
          <router-link to="/vedic_daily">Open Vedic Daily</router-link> for a saved birthday.
        </p>
      </section>

      <section>
        <h2>Limits</h2>
        <ul>
          <li>Positions come from astronomia (VSOP87 / Meeus), natal-grade, not JPL/Swiss Ephemeris.</li>
          <li>No divisional charts (D-9 Navamśa, etc.), yogas, or Ashtakoota matching in this version.</li>
          <li>Gochara and dated daśā live on Vedic Daily; the natal page still shows the current mahādaśā / antardaśā only.</li>
          <li>Interpretations are rule-based educational text, not medical, legal, or financial advice.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { usePageTitle } from '@/composables/usePageTitle';
export default {
  name: 'VedicHelp',
  setup() {
    usePageTitle('Jyotish guide');
  },
};
</script>

<style scoped>
.help-body section {
  margin-bottom: 2rem;
}
.help-body h2 {
  border-bottom: 2px solid #c9a227;
  padding-bottom: 0.35rem;
  margin-bottom: 0.75rem;
  color: #4a3b16;
}
pre {
  background: #f8f4ea;
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
}
</style>
