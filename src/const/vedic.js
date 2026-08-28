/**
 * Jyotish (Vedic astrology) tables and bilingual interpretation copy.
 * Labels always pair Sanskrit with English: "Sūrya (Sun)", "Meṣa (Aries)".
 */

export function bilingual(sanskrit, english) {
  if (!sanskrit) return english || '';
  if (!english || sanskrit === english) return sanskrit;
  return `${sanskrit} (${english})`;
}

export const RASHIS = [
  {
    id: 1, key: 'aries', nameEn: 'Aries', nameSa: 'Meṣa',
    element: 'Fire', elementSa: 'Agni', modality: 'Movable', modalitySa: 'Chara',
    lord: 'mars', symbol: '♈',
    lagnaBlurb: 'A Meṣa (Aries) Lagna (Ascendant) gives a direct, pioneering presence. The body and personality tend toward initiative, heat, and a preference for starting rather than waiting.',
    moonBlurb: 'Moon in Meṣa (Aries) makes the mind restless, brave, and quick to react. Feelings arrive as impulses; the native needs motion and a cause.',
    sunBlurb: 'Sun in Meṣa (Aries) is exalted in spirit even before dignity is counted: will, leadership, and a need to be first colour the soul-purpose.',
  },
  {
    id: 2, key: 'taurus', nameEn: 'Taurus', nameSa: 'Vṛṣabha',
    element: 'Earth', elementSa: 'Pṛthvī', modality: 'Fixed', modalitySa: 'Sthira',
    lord: 'venus', symbol: '♉',
    lagnaBlurb: 'A Vṛṣabha (Taurus) Lagna (Ascendant) is steady, sensual, and stubborn in a constructive way. Comfort, beauty, and resources matter to how the self is presented.',
    moonBlurb: 'Moon in Vṛṣabha (Taurus) is classically exalted: the mind seeks security, music, food, and loyal affection. Change feels threatening until it is proven safe.',
    sunBlurb: 'Sun in Vṛṣabha (Taurus) expresses purpose through building, collecting, and holding. Pride is tied to what has been made lasting.',
  },
  {
    id: 3, key: 'gemini', nameEn: 'Gemini', nameSa: 'Mithuna',
    element: 'Air', elementSa: 'Vāyu', modality: 'Dual', modalitySa: 'Dvisvabhāva',
    lord: 'mercury', symbol: '♊',
    lagnaBlurb: 'A Mithuna (Gemini) Lagna (Ascendant) is curious, verbal, and youthfully adaptable. The native meets the world through questions, jokes, and dual interests.',
    moonBlurb: 'Moon in Mithuna (Gemini) thinks in conversation. Moods shift with information; restlessness is eased by learning and company.',
    sunBlurb: 'Sun in Mithuna (Gemini) finds purpose in communication, trade, and connecting people or ideas. Identity is often dual or multifaceted.',
  },
  {
    id: 4, key: 'cancer', nameEn: 'Cancer', nameSa: 'Karka',
    element: 'Water', elementSa: 'Jala', modality: 'Movable', modalitySa: 'Chara',
    lord: 'moon', symbol: '♋',
    lagnaBlurb: 'A Karka (Cancer) Lagna (Ascendant) is protective, lunar, and home-oriented. The body and face often show feeling before speech does.',
    moonBlurb: 'Moon in Karka (Cancer) is in its own sign: memory, family, and belonging dominate the inner weather. Sensitivity is a strength when bounded.',
    sunBlurb: 'Sun in Karka (Cancer) ties soul-purpose to caretaking, ancestry, and emotional authority. Public life may still feel private.',
  },
  {
    id: 5, key: 'leo', nameEn: 'Leo', nameSa: 'Siṃha',
    element: 'Fire', elementSa: 'Agni', modality: 'Fixed', modalitySa: 'Sthira',
    lord: 'sun', symbol: '♌',
    lagnaBlurb: 'A Siṃha (Leo) Lagna (Ascendant) carries warmth, dignity, and a need to be seen. Loyalty and pride shape the self-image.',
    moonBlurb: 'Moon in Siṃha (Leo) wants recognition for the heart. Generosity is natural; so is hurt when appreciation is missing.',
    sunBlurb: 'Sun in Siṃha (Leo) is in its own sign: purpose, father-themes, and creative authority sit at the centre of the chart’s fire.',
  },
  {
    id: 6, key: 'virgo', nameEn: 'Virgo', nameSa: 'Kanyā',
    element: 'Earth', elementSa: 'Pṛthvī', modality: 'Dual', modalitySa: 'Dvisvabhāva',
    lord: 'mercury', symbol: '♍',
    lagnaBlurb: 'A Kanyā (Virgo) Lagna (Ascendant) is discriminating, service-minded, and detail-aware. The body often tracks diet, routine, and worry.',
    moonBlurb: 'Moon in Kanyā (Virgo) analyses feeling. The mind wants order; anxiety eases when work is useful and precise.',
    sunBlurb: 'Sun in Kanyā (Virgo) expresses dharma through craft, healing, and improvement. Purpose is found in what can be fixed or refined.',
  },
  {
    id: 7, key: 'libra', nameEn: 'Libra', nameSa: 'Tulā',
    element: 'Air', elementSa: 'Vāyu', modality: 'Movable', modalitySa: 'Chara',
    lord: 'venus', symbol: '♎',
    lagnaBlurb: 'A Tulā (Libra) Lagna (Ascendant) seeks balance, beauty, and fair exchange. The self is often defined in relation to others.',
    moonBlurb: 'Moon in Tulā (Libra) needs harmony. Indecision is the shadow of a mind that weighs every side before it rests.',
    sunBlurb: 'Sun in Tulā (Libra) is classically debilitated in dignity terms: the will prefers partnership over solitary command, and justice over force.',
  },
  {
    id: 8, key: 'scorpio', nameEn: 'Scorpio', nameSa: 'Vṛścika',
    element: 'Water', elementSa: 'Jala', modality: 'Fixed', modalitySa: 'Sthira',
    lord: 'mars', symbol: '♏',
    lagnaBlurb: 'A Vṛścika (Scorpio) Lagna (Ascendant) is intense, private, and regenerative. The native does not show all of the self at once.',
    moonBlurb: 'Moon in Vṛścika (Scorpio) is classically debilitated: feelings run deep, secret, and transformative. Trust is earned slowly.',
    sunBlurb: 'Sun in Vṛścika (Scorpio) pursues purpose through crisis, research, and rebirth. Control and surrender are lifelong lessons.',
  },
  {
    id: 9, key: 'sagittarius', nameEn: 'Sagittarius', nameSa: 'Dhanu',
    element: 'Fire', elementSa: 'Agni', modality: 'Dual', modalitySa: 'Dvisvabhāva',
    lord: 'jupiter', symbol: '♐',
    lagnaBlurb: 'A Dhanu (Sagittarius) Lagna (Ascendant) is philosophical, restless, and ethically minded. The gait and gaze often aim past the horizon.',
    moonBlurb: 'Moon in Dhanu (Sagittarius) needs meaning and open space. Optimism returns when belief and travel (literal or mental) are allowed.',
    sunBlurb: 'Sun in Dhanu (Sagittarius) orients the soul toward teaching, faith, and the long road. Purpose is a quest, not a post.',
  },
  {
    id: 10, key: 'capricorn', nameEn: 'Capricorn', nameSa: 'Makara',
    element: 'Earth', elementSa: 'Pṛthvī', modality: 'Movable', modalitySa: 'Chara',
    lord: 'saturn', symbol: '♑',
    lagnaBlurb: 'A Makara (Capricorn) Lagna (Ascendant) is reserved, ambitious, and durable. The self is built over decades, not announced overnight.',
    moonBlurb: 'Moon in Makara (Capricorn) takes feeling seriously and sometimes coldly. Duty soothes the mind more than comfort does.',
    sunBlurb: 'Sun in Makara (Capricorn) seeks respectable achievement. Father and authority themes mature with time and structure.',
  },
  {
    id: 11, key: 'aquarius', nameEn: 'Aquarius', nameSa: 'Kumbha',
    element: 'Air', elementSa: 'Vāyu', modality: 'Fixed', modalitySa: 'Sthira',
    lord: 'saturn', symbol: '♒',
    lagnaBlurb: 'A Kumbha (Aquarius) Lagna (Ascendant) is independent, humanitarian, and slightly detached. The native belongs to groups without being owned by them.',
    moonBlurb: 'Moon in Kumbha (Aquarius) thinks in systems and causes. Friendship can replace family as the emotional climate.',
    sunBlurb: 'Sun in Kumbha (Aquarius) finds purpose in networks, reform, and the future. Ego is cooler; ideals are hotter.',
  },
  {
    id: 12, key: 'pisces', nameEn: 'Pisces', nameSa: 'Mīna',
    element: 'Water', elementSa: 'Jala', modality: 'Dual', modalitySa: 'Dvisvabhāva',
    lord: 'jupiter', symbol: '♓',
    lagnaBlurb: 'A Mīna (Pisces) Lagna (Ascendant) is permeable, imaginative, and spiritually inclined. Boundaries of the self are learned, not given.',
    moonBlurb: 'Moon in Mīna (Pisces) dreams, empathises, and absorbs. Solitude and art keep the mind from drowning in others’ weather.',
    sunBlurb: 'Sun in Mīna (Pisces) seeks a purpose larger than the person: devotion, art, or service without a spotlight.',
  },
];

export const GRAHAS = [
  {
    key: 'sun', nameEn: 'Sun', nameSa: 'Sūrya', glyph: '☉', abbr: 'Su',
    color: '#E67E22', karaka: 'Soul, father, authority, vitality',
    karakaSa: 'Ātmakāraka themes: ātman, pitṛ, rājya',
    dashaBlurb: 'A Sūrya (Sun) period highlights father, status, health of the heart/eyes, and the will to occupy a centre. Ego and dharma come into the light.',
  },
  {
    key: 'moon', nameEn: 'Moon', nameSa: 'Chandra', glyph: '☽', abbr: 'Mo',
    color: '#7F8C8D', karaka: 'Mind, mother, emotions, public',
    karakaSa: 'Manas, mātṛ, rasa',
    dashaBlurb: 'A Chandra (Moon) period emphasises mother, home, mood, popularity, and the need for nourishment. The mind’s weather becomes the life weather.',
  },
  {
    key: 'mars', nameEn: 'Mars', nameSa: 'Maṅgala', glyph: '♂', abbr: 'Ma',
    color: '#C0392B', karaka: 'Energy, siblings, courage, conflict',
    karakaSa: 'Vīrya, bhrātṛ, senā',
    dashaBlurb: 'A Maṅgala (Mars) period activates courage, siblings, land, surgery/accidents, and decisive action. Heat must be aimed or it burns.',
  },
  {
    key: 'mercury', nameEn: 'Mercury', nameSa: 'Budha', glyph: '☿', abbr: 'Me',
    color: '#27AE60', karaka: 'Intellect, speech, trade, skill',
    karakaSa: 'Buddhi, vāc, vyāpāra',
    dashaBlurb: 'A Budha (Mercury) period favours study, writing, commerce, humour, and short travel. The quality of speech and discrimination sets the tone.',
  },
  {
    key: 'jupiter', nameEn: 'Jupiter', nameSa: 'Guru', glyph: '♃', abbr: 'Ju',
    color: '#F1C40F', karaka: 'Wisdom, children, dharma, teachers',
    karakaSa: 'Jñāna, putra, dharma, guru',
    dashaBlurb: 'A Guru (Jupiter) period expands faith, teachers, children, and good fortune. Growth comes through ethics and a bigger view, not shortcuts.',
  },
  {
    key: 'venus', nameEn: 'Venus', nameSa: 'Śukra', glyph: '♀', abbr: 'Ve',
    color: '#E91E63', karaka: 'Love, arts, vehicles, comfort, spouse (for men)',
    karakaSa: 'Kāma, kalā, śukra',
    dashaBlurb: 'A Śukra (Venus) period brings relationship, beauty, luxury, and the arts to the foreground. Pleasure teaches; excess also teaches.',
  },
  {
    key: 'saturn', nameEn: 'Saturn', nameSa: 'Śani', glyph: '♄', abbr: 'Sa',
    color: '#34495E', karaka: 'Karma, delay, longevity, labour, elders',
    karakaSa: 'Karma, āyu, śrama',
    dashaBlurb: 'A Śani (Saturn) period slows the clock: duty, delay, bones, elders, and structural work. What is earned the hard way tends to last.',
  },
  {
    key: 'rahu', nameEn: 'Rahu', nameSa: 'Rāhu', glyph: '☊', abbr: 'Ra',
    color: '#8E44AD', karaka: 'Obsession, foreign, unconventional desire, eclipse',
    karakaSa: 'Tamas, mleccha, chāyā',
    dashaBlurb: 'A Rāhu period pulls toward the unfamiliar: foreign lands, unconventional status, and appetite that does not satiate easily. Discernment is the remedy.',
  },
  {
    key: 'ketu', nameEn: 'Ketu', nameSa: 'Ketu', glyph: '☋', abbr: 'Ke',
    color: '#795548', karaka: 'Detachment, moksha, past skill, loss of form',
    karakaSa: 'Mokṣa, vairāgya, pūrva-puṇya',
    dashaBlurb: 'A Ketu period thins attachments. Insight, isolation, occult study, or sudden cuts can appear. The invitation is inward, not toward more.',
  },
];

export const GRAHA_BY_KEY = Object.fromEntries(GRAHAS.map((g) => [g.key, g]));

export const HOUSES = [
  { number: 1, nameEn: 'Self / Body', nameSa: 'Lagna / Tanu', group: 'Kendra & Trikona', groupEn: 'Angular and trinal', keywords: 'Personality, vitality, appearance, how life is begun' },
  { number: 2, nameEn: 'Wealth / Speech', nameSa: 'Dhana', group: 'Maraka', groupEn: 'Sustenance', keywords: 'Family, food, money, voice, early education' },
  { number: 3, nameEn: 'Siblings / Courage', nameSa: 'Sahaja', group: 'Upachaya', groupEn: 'Growth house', keywords: 'Effort, younger siblings, short travel, skills, valour' },
  { number: 4, nameEn: 'Home / Mother', nameSa: 'Sukha', group: 'Kendra', groupEn: 'Angular', keywords: 'Mother, property, vehicles, inner peace, education foundation' },
  { number: 5, nameEn: 'Children / Intelligence', nameSa: 'Putra', group: 'Trikona', groupEn: 'Trinal', keywords: 'Creativity, romance, mantra, speculation, past merit' },
  { number: 6, nameEn: 'Enemies / Disease', nameSa: 'Ripu / Roga', group: 'Dusthāna & Upachaya', groupEn: 'Difficult and growth', keywords: 'Service, debts, competition, daily work, health struggles' },
  { number: 7, nameEn: 'Partnership / Marriage', nameSa: 'Kalatra', group: 'Kendra', groupEn: 'Angular', keywords: 'Spouse, contracts, the other, business partners' },
  { number: 8, nameEn: 'Longevity / Transformation', nameSa: 'Āyur', group: 'Dusthāna', groupEn: 'Difficult house', keywords: 'Shared resources, occult, crisis, inheritance, research' },
  { number: 9, nameEn: 'Dharma / Fortune', nameSa: 'Dharma', group: 'Trikona', groupEn: 'Trinal', keywords: 'Father, guru, higher learning, luck, long travel, ethics' },
  { number: 10, nameEn: 'Career / Status', nameSa: 'Karma', group: 'Kendra', groupEn: 'Angular', keywords: 'Profession, public standing, authority, life’s work' },
  { number: 11, nameEn: 'Gains / Friends', nameSa: 'Lābha', group: 'Upachaya', groupEn: 'Growth house', keywords: 'Income, alliances, elder siblings, fulfilment of desires' },
  { number: 12, nameEn: 'Loss / Liberation', nameSa: 'Vyaya', group: 'Dusthāna', groupEn: 'Difficult house', keywords: 'Expenses, foreign residence, sleep, moksha, isolation' },
];

export const NAKSHATRAS = [
  { id: 1, nameEn: 'Ashwini', nameSa: 'Aśvinī', lord: 'ketu', deity: 'Aśvin twins', keywords: 'Healing, speed, beginnings, the horsemen' },
  { id: 2, nameEn: 'Bharani', nameSa: 'Bharaṇī', lord: 'venus', deity: 'Yama', keywords: 'Bearing, restraint, birth-and-death thresholds' },
  { id: 3, nameEn: 'Krittika', nameSa: 'Kṛttikā', lord: 'sun', deity: 'Agni', keywords: 'Cutting, purification, fame, the razor' },
  { id: 4, nameEn: 'Rohini', nameSa: 'Rohiṇī', lord: 'moon', deity: 'Brahmā / Prajāpati', keywords: 'Growth, beauty, fertility, the red one' },
  { id: 5, nameEn: 'Mrigashira', nameSa: 'Mṛgaśīrṣa', lord: 'mars', deity: 'Soma', keywords: 'Seeking, the deer’s head, gentle hunt' },
  { id: 6, nameEn: 'Ardra', nameSa: 'Ārdrā', lord: 'rahu', deity: 'Rudra', keywords: 'Storm, tears, fierce insight, renewal after wreck' },
  { id: 7, nameEn: 'Punarvasu', nameSa: 'Punarvasu', lord: 'jupiter', deity: 'Aditi', keywords: 'Return of the light, restoration, the quiver refilled' },
  { id: 8, nameEn: 'Pushya', nameSa: 'Puṣya', lord: 'saturn', deity: 'Bṛhaspati', keywords: 'Nourishment, the flower, most auspicious lunar mansion' },
  { id: 9, nameEn: 'Ashlesha', nameSa: 'Āśleṣā', lord: 'mercury', deity: 'Nāgas', keywords: 'Embrace, hypnotic wisdom, the coiled serpent' },
  { id: 10, nameEn: 'Magha', nameSa: 'Maghā', lord: 'ketu', deity: 'Pitṛs', keywords: 'Ancestors, throne, inherited power' },
  { id: 11, nameEn: 'Purva Phalguni', nameSa: 'Pūrva Phalgunī', lord: 'venus', deity: 'Bhaga', keywords: 'Delight, union, the front legs of the bed' },
  { id: 12, nameEn: 'Uttara Phalguni', nameSa: 'Uttara Phalgunī', lord: 'sun', deity: 'Aryaman', keywords: 'Patronage, contracts, the rear of the bed' },
  { id: 13, nameEn: 'Hasta', nameSa: 'Hasta', lord: 'moon', deity: 'Savitar', keywords: 'The hand, craft, clever manifestation' },
  { id: 14, nameEn: 'Chitra', nameSa: 'Chitrā', lord: 'mars', deity: 'Tvaṣṭṛ', keywords: 'The shining jewel, design, Maya’s craftsman' },
  { id: 15, nameEn: 'Swati', nameSa: 'Svātī', lord: 'rahu', deity: 'Vāyu', keywords: 'Independence, the young shoot in wind' },
  { id: 16, nameEn: 'Vishakha', nameSa: 'Viśākhā', lord: 'jupiter', deity: 'Indra-Agni', keywords: 'Forked purpose, triumph after split effort' },
  { id: 17, nameEn: 'Anuradha', nameSa: 'Anurādhā', lord: 'saturn', deity: 'Mitra', keywords: 'Friendship, devotion, success after another' },
  { id: 18, nameEn: 'Jyeshtha', nameSa: 'Jyeṣṭhā', lord: 'mercury', deity: 'Indra', keywords: 'The eldest, protection, fierce seniority' },
  { id: 19, nameEn: 'Mula', nameSa: 'Mūla', lord: 'ketu', deity: 'Nirṛti', keywords: 'The root, uprooting, investigation to the base' },
  { id: 20, nameEn: 'Purva Ashadha', nameSa: 'Pūrva Āṣāḍhā', lord: 'venus', deity: 'Āpas', keywords: 'The invincible, early victory, spreading waters' },
  { id: 21, nameEn: 'Uttara Ashadha', nameSa: 'Uttara Āṣāḍhā', lord: 'sun', deity: 'Viśvedevas', keywords: 'Later victory, enduring alliance, the unconquered' },
  { id: 22, nameEn: 'Shravana', nameSa: 'Śravaṇa', lord: 'moon', deity: 'Viṣṇu', keywords: 'Listening, learning, the three footsteps' },
  { id: 23, nameEn: 'Dhanishta', nameSa: 'Dhaniṣṭhā', lord: 'mars', deity: 'Vasus', keywords: 'Drum of wealth, rhythm, fame through skill' },
  { id: 24, nameEn: 'Shatabhisha', nameSa: 'Śatabhiṣā', lord: 'rahu', deity: 'Varuṇa', keywords: 'A hundred healers, the veil, oceanic medicine' },
  { id: 25, nameEn: 'Purva Bhadrapada', nameSa: 'Pūrva Bhādrapadā', lord: 'jupiter', deity: 'Aja Ekapāda', keywords: 'The burning pair, austerity, the front funeral cot' },
  { id: 26, nameEn: 'Uttara Bhadrapada', nameSa: 'Uttara Bhādrapadā', lord: 'saturn', deity: 'Ahir Budhnya', keywords: 'The deep serpent, patience, the rear funeral cot' },
  { id: 27, nameEn: 'Revati', nameSa: 'Revatī', lord: 'mercury', deity: 'Pūṣan', keywords: 'Nourishing the flock, safe passage, the end of the wheel' },
];

export const DIGNITY = {
  sun: { exaltSign: 1, exaltDeg: 10, debilSign: 7, own: [5], mool: { sign: 5, from: 0, to: 20 }, friends: ['moon', 'mars', 'jupiter'], enemies: ['venus', 'saturn'], neutral: ['mercury'] },
  moon: { exaltSign: 2, exaltDeg: 3, debilSign: 8, own: [4], mool: { sign: 2, from: 4, to: 20 }, friends: ['sun', 'mercury'], enemies: [], neutral: ['mars', 'jupiter', 'venus', 'saturn'] },
  mars: { exaltSign: 10, exaltDeg: 28, debilSign: 4, own: [1, 8], mool: { sign: 1, from: 0, to: 12 }, friends: ['sun', 'moon', 'jupiter'], enemies: ['mercury'], neutral: ['venus', 'saturn'] },
  mercury: { exaltSign: 6, exaltDeg: 15, debilSign: 12, own: [3, 6], mool: { sign: 6, from: 16, to: 20 }, friends: ['sun', 'venus'], enemies: ['moon'], neutral: ['mars', 'jupiter', 'saturn'] },
  jupiter: { exaltSign: 4, exaltDeg: 5, debilSign: 10, own: [9, 12], mool: { sign: 9, from: 0, to: 10 }, friends: ['sun', 'moon', 'mars'], enemies: ['mercury', 'venus'], neutral: ['saturn'] },
  venus: { exaltSign: 12, exaltDeg: 27, debilSign: 6, own: [2, 7], mool: { sign: 7, from: 0, to: 15 }, friends: ['mercury', 'saturn'], enemies: ['sun', 'moon'], neutral: ['mars', 'jupiter'] },
  saturn: { exaltSign: 7, exaltDeg: 20, debilSign: 1, own: [10, 11], mool: { sign: 11, from: 0, to: 20 }, friends: ['mercury', 'venus'], enemies: ['sun', 'moon', 'mars'], neutral: ['jupiter'] },
  rahu: { exaltSign: 2, exaltDeg: 20, debilSign: 8, own: [3, 11], mool: { sign: 3, from: 0, to: 20 }, friends: ['mercury', 'venus', 'saturn'], enemies: ['sun', 'moon', 'mars'], neutral: ['jupiter'] },
  ketu: { exaltSign: 8, exaltDeg: 20, debilSign: 2, own: [6, 12], mool: { sign: 6, from: 0, to: 20 }, friends: ['mars', 'jupiter', 'sun'], enemies: ['moon', 'mercury'], neutral: ['venus', 'saturn'] },
};

export const DIGNITY_LABELS = {
  exalted: { en: 'Exalted', sa: 'Uccha', blurb: 'The graha is in its sign of exaltation (uccha) — peak capacity to give its significations.' },
  moolatrikona: { en: 'Root trine', sa: 'Mūlatrikoṇa', blurb: 'The graha sits in its mūlatrikoṇa (root-trine) range — stable, purposeful strength.' },
  own: { en: 'Own sign', sa: 'Svasthāna / Swakshetra', blurb: 'The graha is in its own sign (swakshetra) and acts with comfort and authority.' },
  friend: { en: 'Friend’s sign', sa: 'Mitra-rāśi', blurb: 'The graha occupies a friend’s sign and cooperates more readily.' },
  neutral: { en: 'Neutral sign', sa: 'Sama-rāśi', blurb: 'The graha is in a neutral sign — neither boosted nor obstructed by the host.' },
  enemy: { en: 'Enemy’s sign', sa: 'Śatru-rāśi', blurb: 'The graha is in an enemy’s sign and may struggle to deliver its promises cleanly.' },
  debilitated: { en: 'Debilitated', sa: 'Nīcha', blurb: 'The graha is in its sign of debilitation (nīcha) — significations are strained or inverted until other strengths compensate.' },
};

export const DRISHTI = {
  sun: [7],
  moon: [7],
  mars: [4, 7, 8],
  mercury: [7],
  jupiter: [5, 7, 9],
  venus: [7],
  saturn: [3, 7, 10],
  rahu: [5, 7, 9],
  ketu: [5, 7, 9],
};

export const VIMSHOTTARI = [
  { key: 'ketu', years: 7 },
  { key: 'venus', years: 20 },
  { key: 'sun', years: 6 },
  { key: 'moon', years: 10 },
  { key: 'mars', years: 7 },
  { key: 'rahu', years: 18 },
  { key: 'jupiter', years: 16 },
  { key: 'saturn', years: 19 },
  { key: 'mercury', years: 17 },
];

export const VIMSHOTTARI_TOTAL = 120;

export const TIMEZONE_PRESETS = [
  { label: 'UTC', offset: 0 },
  { label: 'IST — India (UTC+05:30)', offset: 330 },
  { label: 'NPT — Nepal (UTC+05:45)', offset: 345 },
  { label: 'PKT — Pakistan (UTC+05:00)', offset: 300 },
  { label: 'BST — Bangladesh (UTC+06:00)', offset: 360 },
  { label: 'GST — Dubai (UTC+04:00)', offset: 240 },
  { label: 'GMT/UK (UTC+00:00)', offset: 0 },
  { label: 'CET — Central Europe (UTC+01:00)', offset: 60 },
  { label: 'EET — Eastern Europe (UTC+02:00)', offset: 120 },
  { label: 'EST — US Eastern (UTC−05:00)', offset: -300 },
  { label: 'CST — US Central (UTC−06:00)', offset: -360 },
  { label: 'MST — US Mountain (UTC−07:00)', offset: -420 },
  { label: 'PST — US Pacific (UTC−08:00)', offset: -480 },
  { label: 'BRT — Brazil (UTC−03:00)', offset: -180 },
  { label: 'JST — Japan (UTC+09:00)', offset: 540 },
  { label: 'CST — China (UTC+08:00)', offset: 480 },
  { label: 'SGT — Singapore (UTC+08:00)', offset: 480 },
  { label: 'AEST — Australia East (UTC+10:00)', offset: 600 },
  { label: 'NZST — New Zealand (UTC+12:00)', offset: 720 },
  { label: 'SAST — South Africa (UTC+02:00)', offset: 120 },
];

export const AYANAMSA_NAME = { en: 'Lahiri (Chitrapaksha)', sa: 'Lāhirī / Chitrāpakṣa' };

export function rashiById(id) {
  return RASHIS[(id - 1 + 12) % 12];
}

export function rashiLabel(rashi) {
  if (!rashi) return '';
  return bilingual(rashi.nameSa, rashi.nameEn);
}

export function grahaLabel(graha) {
  if (!graha) return '';
  return bilingual(graha.nameSa, graha.nameEn);
}

export function houseLabel(house) {
  if (!house) return '';
  return `House ${house.number} — ${bilingual(house.nameSa, house.nameEn)}`;
}

export function nakshatraLabel(n) {
  if (!n) return '';
  return bilingual(n.nameSa, n.nameEn);
}

export function dignityLabel(key) {
  const d = DIGNITY_LABELS[key];
  if (!d) return key;
  return bilingual(d.sa, d.en);
}

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

export function norm360(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function rashiFromLongitude(longitude) {
  const lon = norm360(longitude);
  const id = Math.floor(lon / 30) + 1;
  const rashi = rashiById(id);
  return {
    id,
    degreeInSign: lon % 30,
    rashi,
    label: rashiLabel(rashi),
  };
}

export function nakshatraFromLongitude(longitude) {
  const lon = norm360(longitude);
  const idx = Math.min(26, Math.floor(lon / NAKSHATRA_SPAN));
  const into = lon - idx * NAKSHATRA_SPAN;
  const pada = Math.min(4, Math.floor(into / PADA_SPAN) + 1);
  const n = NAKSHATRAS[idx];
  return {
    index: idx,
    pada,
    progress: into / NAKSHATRA_SPAN,
    nakshatra: n,
    label: nakshatraLabel(n),
    lord: n.lord,
  };
}

/** Short, everyday language for executive summaries. */
export const PLAIN_SIGN = {
  aries: { face: 'people meet you as direct, impatient, and ready to start', heart: 'you feel best when something is moving', will: 'your drive is to go first' },
  taurus: { face: 'people meet you as steady, sensual, and hard to rush', heart: 'you feel best with comfort, loyalty, and a full fridge', will: 'your drive is to build something that lasts' },
  gemini: { face: 'people meet you as curious, talkative, and a little restless', heart: 'you feel best when there is news, a joke, or a second interest', will: 'your drive is to connect ideas and people' },
  cancer: { face: 'people meet you as caring, private, and protective', heart: 'you feel best when home and the people you love are safe', will: 'your drive is to look after what is yours' },
  leo: { face: 'people meet you as warm, proud, and hard to ignore', heart: 'you feel best when the heart is seen and appreciated', will: 'your drive is to create and to be generous' },
  virgo: { face: 'people meet you as helpful, precise, and quietly critical', heart: 'you feel best when the details are in order and useful', will: 'your drive is to fix, refine, and serve well' },
  libra: { face: 'people meet you as gracious, fair, and a bit indecisive', heart: 'you feel best when the room is peaceful and beautiful', will: 'your drive is to find balance with other people' },
  scorpio: { face: 'people meet you as intense, private, and hard to fool', heart: 'you feel best when trust is real — or not offered at all', will: 'your drive is to go deep and not look away' },
  sagittarius: { face: 'people meet you as frank, restless, and bigger than the room', heart: 'you feel best with meaning, humour, and open space', will: 'your drive is to learn, teach, and keep a horizon' },
  capricorn: { face: 'people meet you as capable, reserved, and older than your years', heart: 'you feel best when duty is done and respect is earned', will: 'your drive is to climb and to make it last' },
  aquarius: { face: 'people meet you as original, friendly, and a little detached', heart: 'you feel best among friends and future-facing ideas', will: 'your drive is to belong without being owned' },
  pisces: { face: 'people meet you as kind, dreamy, and a bit hard to pin down', heart: 'you feel best when there is music, rest, or a larger story', will: 'your drive is to dissolve borders and to care' },
};

export const PLAIN_DIGNITY = {
  exalted: 'this part of you works with unusual ease',
  moolatrikona: 'this part of you has a stable, useful strength',
  own: 'this part of you is at home',
  friend: 'this part of you has friendly conditions',
  neutral: 'this part of you works in an ordinary way',
  enemy: 'this part of you has to try harder than usual',
  debilitated: 'this part of you takes extra work and patience',
};

export const PLAIN_HOUSE_FOCUS = {
  1: 'how you come across and how you start things',
  2: 'money, voice, and what you keep',
  3: 'courage, siblings, and short efforts',
  4: 'home, mother, and inner peace',
  5: 'creativity, romance, and children',
  6: 'daily work, health, and problems to solve',
  7: 'partnership and the people you meet as equals',
  8: 'deep change, shared money, and what is hidden',
  9: 'belief, luck, teachers, and long journeys',
  10: 'career, reputation, and public work',
  11: 'friends, gains, and what you hope for',
  12: 'rest, letting go, and life behind the scenes',
};

/** Nine taras counted from the janma nakshatra — the classical daily Moon clock. */
export const NAVATARA = [
  { key: 'janma', sa: 'Janma', en: 'birth star', tone: 'personal — body, vitality, and how the day starts' },
  { key: 'sampat', sa: 'Sampat', en: 'wealth', tone: 'gain, resources, and what comes in' },
  { key: 'vipat', sa: 'Vipat', en: 'danger', tone: 'caution — obstacles and missteps are louder' },
  { key: 'kshema', sa: 'Kṣema', en: 'welfare', tone: 'protection, ease, and a safer stretch' },
  { key: 'pratyari', sa: 'Pratyari', en: 'adversary', tone: 'opposition — watch conflict and rivalry' },
  { key: 'sadhaka', sa: 'Sādhaka', en: 'accomplishment', tone: 'effort pays; work toward a result' },
  { key: 'naidhana', sa: 'Naidhana', en: 'loss', tone: 'endings and leaks — keep the day light' },
  { key: 'mitra', sa: 'Mitra', en: 'friend', tone: 'allies, support, and easier company' },
  { key: 'paramamitra', sa: 'Paramamitra', en: 'best friend', tone: 'favour, ease, and a helpful sky' },
];

export const PLAIN_PERIOD = {
  sun: 'standing in the light, father-themes, and pride',
  moon: 'home, mood, and what nourishes you',
  mars: 'courage, conflict, and getting things done',
  mercury: 'study, talk, trade, and the mind',
  jupiter: 'growth, teachers, faith, and good fortune',
  venus: 'love, beauty, pleasure, and what you enjoy',
  saturn: 'patience, duty, delays, and what is earned the hard way',
  rahu: 'the unfamiliar, appetite, and a hunger that is hard to fill',
  ketu: 'letting go, insight, and turning inward',
};
