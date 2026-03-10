/**
 * Sample profiles for the I-Ching Dating App demo
 * These profiles showcase various zodiac animals, elements, and personality types
 */

export const sampleProfiles = [
  {
    id: 1001,
    name: 'Luna Chen',
    displayName: 'Luna',
    birthday: '1990-03-21T14:30:00',
    gender: 'FEMALE',
    coords: { latitude: 31.2304, longitude: 121.4737 }, // Shanghai
    place: 'Shanghai, China',
    bio: 'Meditation enthusiast and yoga instructor seeking mindful connection. I believe in the wisdom of the I-Ching and love exploring ancient philosophies. Looking for someone who values spiritual growth and inner peace.',
    photos: [],
    avatarIndex: 0,
    interests: ['Meditation', 'Yoga', 'Astrology', 'Nature', 'Tea Ceremonies', 'Reading'],
    lookingFor: ['spiritual-partner', 'romance'],
    ageRange: { min: 28, max: 45 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    astrologyProfile: {
      element: 'Metal',
      animal: 'Horse'
    }
  },
  {
    id: 1002,
    name: 'Marcus Wei',
    displayName: 'Marcus',
    birthday: '1988-07-15T08:20:00',
    gender: 'MALE',
    coords: { latitude: 22.3193, longitude: 114.1694 }, // Hong Kong
    place: 'Hong Kong',
    bio: 'Tech entrepreneur with a passion for ancient wisdom. I practice Tai Chi every morning and love exploring the connections between technology and tradition. Seeking someone who appreciates both innovation and heritage.',
    photos: [],
    avatarIndex: 0,
    interests: ['Tai Chi', 'Technology', 'Philosophy', 'Hiking', 'Cooking', 'Music'],
    lookingFor: ['romance', 'friendship'],
    ageRange: { min: 25, max: 40 },
    genderPreference: 'FEMALE',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
    astrologyProfile: {
      element: 'Earth',
      animal: 'Dragon'
    }
  },
  {
    id: 1003,
    name: 'Sakura Tanaka',
    displayName: 'Sakura',
    birthday: '1992-04-05T06:45:00',
    gender: 'FEMALE',
    coords: { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
    place: 'Tokyo, Japan',
    bio: 'Artist and calligrapher exploring the beauty of impermanence. I find inspiration in nature, seasons, and the flow of energy. Looking for a deep connection with someone who appreciates art and mindfulness.',
    photos: [],
    avatarIndex: 0,
    interests: ['Calligraphy', 'Art', 'Nature', 'Photography', 'Tea Ceremonies', 'Gardening'],
    lookingFor: ['romance', 'spiritual-partner'],
    ageRange: { min: 28, max: 45 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    astrologyProfile: {
      element: 'Water',
      animal: 'Monkey'
    }
  },
  {
    id: 1004,
    name: 'David Park',
    displayName: 'David',
    birthday: '1985-11-22T16:00:00',
    gender: 'MALE',
    coords: { latitude: 37.5665, longitude: 126.9780 }, // Seoul
    place: 'Seoul, South Korea',
    bio: 'Acupuncturist and traditional medicine practitioner. I believe in holistic health and the balance of yin and yang. Looking for someone who values wellness and personal growth.',
    photos: [],
    avatarIndex: 0,
    interests: ['Traditional Medicine', 'Martial Arts', 'Meditation', 'Cooking', 'Travel', 'Reading'],
    lookingFor: ['romance'],
    ageRange: { min: 28, max: 42 },
    genderPreference: 'FEMALE',
    isActive: true,
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-08T14:00:00Z',
    astrologyProfile: {
      element: 'Wood',
      animal: 'Ox'
    }
  },
  {
    id: 1005,
    name: 'Emily Zhang',
    displayName: 'Emily',
    birthday: '1995-08-08T12:00:00',
    gender: 'FEMALE',
    coords: { latitude: 39.9042, longitude: 116.4074 }, // Beijing
    place: 'Beijing, China',
    bio: 'Graduate student in philosophy, specializing in Eastern thought. I love deep conversations, stargazing, and exploring ancient temples. Seeking an intellectual and spiritual connection.',
    photos: [],
    avatarIndex: 0,
    interests: ['Philosophy', 'Astronomy', 'History', 'Writing', 'Yoga', 'Museums'],
    lookingFor: ['romance', 'friendship', 'spiritual-partner'],
    ageRange: { min: 24, max: 38 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    astrologyProfile: {
      element: 'Wood',
      animal: 'Pig'
    }
  },
  {
    id: 1006,
    name: 'James Liu',
    displayName: 'James',
    birthday: '1987-02-14T09:30:00',
    gender: 'MALE',
    coords: { latitude: 25.0330, longitude: 121.5654 }, // Taipei
    place: 'Taipei, Taiwan',
    bio: 'Feng Shui consultant and interior designer. I help people create harmonious spaces. Looking for someone who appreciates beauty, balance, and the flow of positive energy in life.',
    photos: [],
    avatarIndex: 0,
    interests: ['Feng Shui', 'Interior Design', 'Architecture', 'Art', 'Travel', 'Photography'],
    lookingFor: ['romance'],
    ageRange: { min: 28, max: 45 },
    genderPreference: 'FEMALE',
    isActive: true,
    createdAt: '2024-01-05T15:00:00Z',
    updatedAt: '2024-01-05T15:00:00Z',
    astrologyProfile: {
      element: 'Fire',
      animal: 'Rabbit'
    }
  },
  {
    id: 1007,
    name: 'Mei Lin',
    displayName: 'Mei',
    birthday: '1993-12-01T20:15:00',
    gender: 'FEMALE',
    coords: { latitude: 1.3521, longitude: 103.8198 }, // Singapore
    place: 'Singapore',
    bio: 'Dance instructor and energy healer. I express through movement and help others find their inner rhythm. Seeking a partner who is open-minded, creative, and values emotional connection.',
    photos: [],
    avatarIndex: 0,
    interests: ['Dance', 'Healing', 'Music', 'Fitness', 'Spirituality', 'Travel'],
    lookingFor: ['romance', 'spiritual-partner'],
    ageRange: { min: 26, max: 40 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-18T19:00:00Z',
    updatedAt: '2024-01-18T19:00:00Z',
    astrologyProfile: {
      element: 'Water',
      animal: 'Rooster'
    }
  },
  {
    id: 1008,
    name: 'Ryan Huang',
    displayName: 'Ryan',
    birthday: '1991-06-21T05:00:00',
    gender: 'MALE',
    coords: { latitude: 23.1291, longitude: 113.2644 }, // Guangzhou
    place: 'Guangzhou, China',
    bio: 'Tea master and entrepreneur. I own a traditional tea house where I share the art of tea ceremony. Looking for someone who appreciates the slower pace of life and meaningful traditions.',
    photos: [],
    avatarIndex: 0,
    interests: ['Tea Ceremonies', 'Business', 'Calligraphy', 'Meditation', 'Cooking', 'Nature'],
    lookingFor: ['romance', 'friendship'],
    ageRange: { min: 25, max: 38 },
    genderPreference: 'FEMALE',
    isActive: true,
    createdAt: '2024-01-22T07:00:00Z',
    updatedAt: '2024-01-22T07:00:00Z',
    astrologyProfile: {
      element: 'Metal',
      animal: 'Goat'
    }
  },
  {
    id: 1009,
    name: 'Sophie Wang',
    displayName: 'Sophie',
    birthday: '1989-09-09T11:11:00',
    gender: 'FEMALE',
    coords: { latitude: 30.5728, longitude: 104.0668 }, // Chengdu
    place: 'Chengdu, China',
    bio: 'Wildlife conservationist working with pandas. I believe in protecting our natural world and living in harmony with nature. Seeking someone who shares my passion for the environment.',
    photos: [],
    avatarIndex: 0,
    interests: ['Wildlife', 'Conservation', 'Nature', 'Hiking', 'Photography', 'Vegetarian Cooking'],
    lookingFor: ['romance', 'spiritual-partner'],
    ageRange: { min: 28, max: 45 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-14T13:00:00Z',
    updatedAt: '2024-01-14T13:00:00Z',
    astrologyProfile: {
      element: 'Earth',
      animal: 'Snake'
    }
  },
  {
    id: 1010,
    name: 'Kevin Wu',
    displayName: 'Kevin',
    birthday: '1986-01-28T22:45:00',
    gender: 'MALE',
    coords: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    place: 'Los Angeles, USA',
    bio: 'Film composer blending Eastern and Western musical traditions. I create soundscapes for meditation and cinema. Looking for someone who feels music as deeply as I do.',
    photos: [],
    avatarIndex: 0,
    interests: ['Music', 'Film', 'Meditation', 'Piano', 'Sound Healing', 'Travel'],
    lookingFor: ['romance'],
    ageRange: { min: 28, max: 42 },
    genderPreference: 'ANY',
    isActive: true,
    createdAt: '2024-01-25T21:00:00Z',
    updatedAt: '2024-01-25T21:00:00Z',
    astrologyProfile: {
      element: 'Fire',
      animal: 'Tiger'
    }
  },
  {
    id: 1011,
    name: 'Anna Lee',
    displayName: 'Anna',
    birthday: '1994-05-15T15:30:00',
    gender: 'FEMALE',
    coords: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    place: 'San Francisco, USA',
    bio: 'Herbalist and wellness coach combining Eastern medicine with modern science. I help people find balance in their busy lives. Seeking a partner who values health and mindful living.',
    photos: [],
    avatarIndex: 0,
    interests: ['Herbalism', 'Wellness', 'Yoga', 'Cooking', 'Hiking', 'Reading'],
    lookingFor: ['romance', 'spiritual-partner'],
    ageRange: { min: 26, max: 40 },
    genderPreference: 'MALE',
    isActive: true,
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
    astrologyProfile: {
      element: 'Wood',
      animal: 'Dog'
    }
  },
  {
    id: 1012,
    name: 'Michael Chen',
    displayName: 'Michael',
    birthday: '1984-10-10T10:10:00',
    gender: 'MALE',
    coords: { latitude: 40.7128, longitude: -74.0060 }, // New York
    place: 'New York, USA',
    bio: 'Qigong instructor and holistic therapist. I teach ancient breathing techniques for modern wellness. Looking for someone who is curious about self-improvement and inner exploration.',
    photos: [],
    avatarIndex: 0,
    interests: ['Qigong', 'Martial Arts', 'Therapy', 'Meditation', 'Teaching', 'Writing'],
    lookingFor: ['romance', 'friendship'],
    ageRange: { min: 30, max: 48 },
    genderPreference: 'FEMALE',
    isActive: true,
    createdAt: '2024-01-09T12:00:00Z',
    updatedAt: '2024-01-09T12:00:00Z',
    astrologyProfile: {
      element: 'Wood',
      animal: 'Rat'
    }
  }
];

/**
 * Get all unique interests from sample profiles (for filter options)
 */
export function getAllInterests() {
  const interestsSet = new Set();
  sampleProfiles.forEach(profile => {
    profile.interests.forEach(interest => interestsSet.add(interest));
  });
  return Array.from(interestsSet).sort();
}

/**
 * Get all unique elements from sample profiles
 */
export function getAllElements() {
  return ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
}

/**
 * Get all zodiac animals
 */
export function getAllAnimals() {
  return [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
}

export default sampleProfiles;
