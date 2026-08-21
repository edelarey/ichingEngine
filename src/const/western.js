export const WESTERN_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars',
    sun: 'Aries Sun: initiating, blunt, and hungry for a contest. Identity is forged by starting things.',
    moon: 'Aries Moon: feelings arrive as heat. The emotional body wants motion, not processing meetings.',
    rising: 'Aries Rising: the world meets a direct, physical presence. First impressions are fast and unfiltered.' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus',
    sun: 'Taurus Sun: loyal, sensual, and slow to pivot. Self-worth is built by what can be held.',
    moon: 'Taurus Moon: safety is tactile — food, music, money, a known room. Change feels like theft until it isn’t.',
    rising: 'Taurus Rising: a grounded, deliberate first impression. The body language says “I am staying.”' },
  { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury',
    sun: 'Gemini Sun: a mind that doubles. Purpose is conversation, variety, and connecting two ideas.',
    moon: 'Gemini Moon: moods talk. Restlessness eases when there is news, a sibling, or a second tab.',
    rising: 'Gemini Rising: quick eyes, lighter gait, a social on-ramp. People meet the messenger first.' },
  { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon',
    sun: 'Cancer Sun: identity shelters. Care, memory, and belonging are how the will shows up.',
    moon: 'Cancer Moon: the classic lunar placement — tides, family weather, a long memory for tone.',
    rising: 'Cancer Rising: a protective face. The first move is to feel the room before occupying it.' },
  { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun',
    sun: 'Leo Sun: the solar signature. Pride, play, and a need to be seen as generous, not small.',
    moon: 'Leo Moon: the heart wants an audience. Loyalty is warm; neglect is taken personally.',
    rising: 'Leo Rising: presence with a spotlight. Even quiet Leos rising still enter as a figure.' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury',
    sun: 'Virgo Sun: purpose is craft and correction. Usefulness is the love language of the ego.',
    moon: 'Virgo Moon: feelings are sorted. Anxiety drops when the body has a task and a clean list.',
    rising: 'Virgo Rising: precise, serviceable first contact. People notice competence before heat.' },
  { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus',
    sun: 'Libra Sun: the self is relational. Fairness, beauty, and the other person complete the sentence.',
    moon: 'Libra Moon: peace-seeking emotionally. Indecision is the cost of never wanting to bruise.',
    rising: 'Libra Rising: charm as diplomacy. The first impression is composed, attractive, and weighing you too.' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', ruler: 'Pluto',
    sun: 'Scorpio Sun: identity goes through the underworld on purpose. Control and honesty wrestle.',
    moon: 'Scorpio Moon: feeling is private and total. Trust is slow; once given, it is a pact.',
    rising: 'Scorpio Rising: a held gaze. The room is scanned for power before a word is spent.' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter',
    sun: 'Sagittarius Sun: meaning over maps. The will wants a horizon, a thesis, and room to be wrong loudly.',
    moon: 'Sagittarius Moon: morale is philosophical. Cramped feelings seek a road, a joke, or a belief.',
    rising: 'Sagittarius Rising: open stride, bigger voice. First contact is candid and slightly abroad.' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn',
    sun: 'Capricorn Sun: ambition with a spine. Respect is earned in public; the inner child clocks in later.',
    moon: 'Capricorn Moon: duty soothes more than comfort. Feelings are scheduled, then honoured quietly.',
    rising: 'Capricorn Rising: composed, older-than-the-age. People assume competence on sight.' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', ruler: 'Uranus',
    sun: 'Aquarius Sun: the person as a system. Ideals, friends, and future-tense identity over clan.',
    moon: 'Aquarius Moon: detachment as a feeling style. Friendship can outrank romance for safety.',
    rising: 'Aquarius Rising: slightly off-axis, memorable. The first impression is original, not ornamental.' },
  { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', ruler: 'Neptune',
    sun: 'Pisces Sun: the self dissolves into story, art, or service. Boundaries are a learned skill.',
    moon: 'Pisces Moon: porous weather. Dreams, music, and other people’s moods leak in unless filtered.',
    rising: 'Pisces Rising: soft edges. People meet a receptive face and may project a myth onto it.' },
];

export const WESTERN_HOUSES = [
  { number: 1, name: '1st — Self', keywords: 'Body, mask, first impression, how life is begun' },
  { number: 2, name: '2nd — Values', keywords: 'Money, possessions, self-worth, what you keep' },
  { number: 3, name: '3rd — Mind', keywords: 'Speech, siblings, short trips, local mind' },
  { number: 4, name: '4th — Home', keywords: 'Roots, mother/father one, private base, ending of things' },
  { number: 5, name: '5th — Creation', keywords: 'Romance, children, art, risk, play' },
  { number: 6, name: '6th — Work', keywords: 'Daily labour, health habits, service, craft' },
  { number: 7, name: '7th — Other', keywords: 'Partnership, open enemies, contracts, the mirror' },
  { number: 8, name: '8th — Depth', keywords: 'Shared money, sex, death/rebirth, the occult' },
  { number: 9, name: '9th — Meaning', keywords: 'Belief, long travel, law, publishing, the teacher' },
  { number: 10, name: '10th — Calling', keywords: 'Career, public rank, the other parent, legacy' },
  { number: 11, name: '11th — Network', keywords: 'Friends, groups, hopes, the future audience' },
  { number: 12, name: '12th — Unseen', keywords: 'Solitude, the unconscious, sacrifice, behind-the-scenes' },
];

export const WESTERN_PLANETS = [
  { key: 'sun', name: 'Sun', symbol: '☉', color: '#FFA500', neverRetro: true, keywords: 'Will, vitality, father, the centre of the chart' },
  { key: 'moon', name: 'Moon', symbol: '☽', color: '#C0C0C0', neverRetro: true, keywords: 'Mood, body, mother, habit, the public' },
  { key: 'mercury', name: 'Mercury', symbol: '☿', color: '#8C7853', keywords: 'Mind, speech, trade, the linking function' },
  { key: 'venus', name: 'Venus', symbol: '♀', color: '#FFC649', keywords: 'Attraction, art, money-pleasure, how you bond' },
  { key: 'mars', name: 'Mars', symbol: '♂', color: '#CD5C5C', keywords: 'Drive, anger, desire, how you fight and pursue' },
  { key: 'jupiter', name: 'Jupiter', symbol: '♃', color: '#D2691E', keywords: 'Growth, faith, luck, the bigger room' },
  { key: 'saturn', name: 'Saturn', symbol: '♄', color: '#8B4513', keywords: 'Structure, delay, fear, mastery through time' },
  { key: 'uranus', name: 'Uranus', symbol: '♅', color: '#4FD0E3', keywords: 'Rupture, genius, the future, non-conformity' },
  { key: 'neptune', name: 'Neptune', symbol: '♆', color: '#4169E1', keywords: 'Dream, fog, compassion, glamour, the dissolve' },
  { key: 'pluto', name: 'Pluto', symbol: '♇', color: '#800080', keywords: 'Power, compost, compulsion, the long transformation' },
  { key: 'northnode', name: 'North Node', symbol: '☊', color: '#2C3E50', alwaysRetro: true, keywords: 'Growth edge, the unfamiliar life-direction' },
  { key: 'southnode', name: 'South Node', symbol: '☋', color: '#7F8C8D', alwaysRetro: true, keywords: 'The well-worn skill, the past-life habit' },
];

export const WESTERN_DIGNITY = {
  sun: { domicile: [5], exaltation: [1], detriment: [11], fall: [7] },
  moon: { domicile: [4], exaltation: [2], detriment: [10], fall: [8] },
  mercury: { domicile: [3, 6], exaltation: [6], detriment: [9, 12], fall: [12] },
  venus: { domicile: [2, 7], exaltation: [12], detriment: [1, 8], fall: [6] },
  mars: { domicile: [1, 8], exaltation: [10], detriment: [7, 2], fall: [4] },
  jupiter: { domicile: [9, 12], exaltation: [4], detriment: [3, 6], fall: [10] },
  saturn: { domicile: [10, 11], exaltation: [7], detriment: [4, 5], fall: [1] },
};

export const DIGNITY_COPY = {
  domicile: 'in domicile (home sign) — speaks with authority',
  exaltation: 'in exaltation — the principle is amplified',
  detriment: 'in detriment — the principle is awkward or overcompensating',
  fall: 'in fall — the principle is strained and must be earned',
  peregrine: 'peregrine — no essential dignity; context (house and aspects) does more of the work',
};

export const ASPECT_TYPES = [
  { name: 'conjunction', angle: 0, orb: 8, symbol: '☌', nature: 'merging', blurb: 'The two principles fuse and colour each other constantly.' },
  { name: 'sextile', angle: 60, orb: 6, symbol: '⚹', nature: 'opportunity', blurb: 'A cooperative link — talent that works if used.' },
  { name: 'square', angle: 90, orb: 8, symbol: '□', nature: 'friction', blurb: 'A productive argument. Growth comes through heat, not ease.' },
  { name: 'trine', angle: 120, orb: 8, symbol: '△', nature: 'flow', blurb: 'Easy circulation of the two principles — a gift that can go unexamined.' },
  { name: 'opposition', angle: 180, orb: 8, symbol: '☍', nature: 'polarity', blurb: 'A seesaw. The other person or the outer world often carries one pole.' },
];

export const PLANET_IN_HOUSE = {
  sun: ['Life is staged through the body and first impression.', 'Worth and resources are solar — identity spends and earns in public.', 'The mind and neighbourhood are a stage; siblings or students matter.', 'The private base is the throne; family history is the script.', 'Creativity, children, and risk are how the self shines.', 'Work and craft are the identity; service is not small.', 'The self is found in partnership; the other is a bright mirror.', 'Shared power and deep change are the solar classroom.', 'Belief, travel, and teaching broadcast the will.', 'Career is the Sun — vocation wants a skyline.', 'Friends and future-facing groups are the court.', 'The light is interior, spiritual, or behind the curtain.'],
  moon: ['Mood is worn on the skin; needs are obvious.', 'Security is food, cash, and a stocked shelf.', 'Feelings talk; the local world is the nest.', 'Classic: home is the emotional organ.', 'Play and children soothe the tides.', 'Routine and the body-clock are the Moon’s kitchen.', 'The partner is the weather system.', 'Intimacy is where the Moon goes to transform.', 'Far places and big ideas feed the heart.', 'Public life has a lunar pulse — reputation as care.', 'The tribe is family; friends mother you.', 'Retreat, sleep, and the unseen restore the Moon.'],
};

export function signFromLongitude(longitude) {
  const lon = ((Number(longitude) % 360) + 360) % 360;
  const id = Number.isFinite(lon) ? Math.floor(lon / 30) % 12 : 0;
  const sign = WESTERN_SIGNS[id] || WESTERN_SIGNS[0];
  return { ...sign, id: id + 1, degreeInSign: Number.isFinite(lon) ? lon % 30 : 0 };
}

export function westernDignity(planetKey, signId) {
  const table = WESTERN_DIGNITY[planetKey];
  if (!table) return { key: 'peregrine', label: DIGNITY_COPY.peregrine };
  if (table.exaltation.includes(signId) && !table.domicile.includes(signId)) {
    return { key: 'exaltation', label: DIGNITY_COPY.exaltation };
  }
  if (table.domicile.includes(signId)) {
    return { key: 'domicile', label: DIGNITY_COPY.domicile };
  }
  if (table.fall.includes(signId)) return { key: 'fall', label: DIGNITY_COPY.fall };
  if (table.detriment.includes(signId)) return { key: 'detriment', label: DIGNITY_COPY.detriment };
  return { key: 'peregrine', label: DIGNITY_COPY.peregrine };
}
