# I-Ching Astrology Dating App Extension Plan

## Executive Summary

This document outlines the plan to extend the existing I-Ching Engine application into an I-Ching Astrology Dating App. The extension will leverage the existing astrological compatibility calculation engine to provide users with a unique, spiritually-grounded approach to finding compatible partners.

**Approach**: Local/Demo MVP version - extend the current frontend-only application with enhanced profile management and matching features using localStorage, with architecture designed for future backend integration.

---

## 1. Current Application Analysis

### 1.1 Existing Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vue 3 Application                        │
├─────────────────────────────────────────────────────────────────┤
│  Entry: src/main.js                                             │
│  ├── Vue Router (SPA navigation)                                │
│  ├── Pinia (State Management with persistence)                  │
│  ├── Bootstrap 5 (UI Framework)                                 │
│  └── vue-good-table-next (Data Display)                         │
├─────────────────────────────────────────────────────────────────┤
│                         Stores                                   │
│  ├── oracle.js (consultation history)                           │
│  ├── birthday.js (birthday data management)                     │
│  ├── astrology.js (chart data and positions)                    │
│  └── spiralSettings.js (visualization settings)                 │
├─────────────────────────────────────────────────────────────────┤
│                    Core Calculation Engine                       │
│  ├── const/astrology.js (4800+ lines)                           │
│  │   ├── IChingAstrology_North / IChingAstrology_South          │
│  │   ├── IChingConsultation class                               │
│  │   ├── calculateCompatibilityByYear()                         │
│  │   └── calculateNatalHexagram()                               │
│  ├── const/hexagram.js                                          │
│  ├── const/bagua.js                                             │
│  └── const/yao.js                                               │
├─────────────────────────────────────────────────────────────────┤
│                         Views                                    │
│  ├── relationship.vue (existing compatibility)                  │
│  ├── astrology.vue (personal astrology)                         │
│  ├── western_astrology.vue                                      │
│  └── Various chart and detail views                             │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Existing Compatibility Features

The application already includes a robust compatibility calculation system in [`src/const/astrology.js`](src/const/astrology.js:88):

| Feature | Function | Description |
|---------|----------|-------------|
| Elemental Compatibility | `calculateElementalCompatibility()` | Scores based on generating/controlling cycles |
| Trigram Compatibility | `trigramHexagramCompatibility` | Pre/Later Heaven trigram alignment |
| Sexagenary Compatibility | `sexagenaryCompatibility` | Stem/Branch harmonization |
| Sub-Cycle Compatibility | `subCycleCompatibility` | Life stage alignment by calendar year |
| Overall Score | `overallCompatibility` | Weighted combination of all factors |

### 1.3 Existing Data Storage

The [`useBirthdayStore`](src/stores/birthday.js:4) already handles:
- Name, birth date/time, gender
- Coordinates (latitude/longitude)
- Place of birth
- CRUD operations with localStorage persistence
- Import/Export functionality

---

## 2. Proposed Extension Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   I-Ching Dating App MVP                        │
├─────────────────────────────────────────────────────────────────┤
│                    NEW: Dating Module                           │
│  ├── stores/dating.js (profiles, matches, favorites)           │
│  ├── views/dating_profiles.vue (profile list/grid)             │
│  ├── views/profile_detail.vue (individual profile)             │
│  ├── views/matches.vue (compatibility results)                 │
│  ├── views/my_profile.vue (user own profile)                  │
│  └── components/                                                │
│      ├── ProfileCard.vue                                        │
│      ├── CompatibilityScore.vue                                 │
│      ├── ProfileForm.vue                                        │
│      └── MatchList.vue                                          │
├─────────────────────────────────────────────────────────────────┤
│                    ENHANCED: Compatibility                      │
│  ├── utils/datingCompatibility.js                               │
│  │   └── Extended scoring with dating-specific factors         │
│  └── composables/useCompatibility.js                           │
│      └── Reactive compatibility calculations                   │
├─────────────────────────────────────────────────────────────────┤
│                    EXISTING: Core Engine                        │
│  └── const/astrology.js (no modifications needed)              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│   Profile    │───▶│   Birthday   │───▶│  Astrology Engine    │
│   Entry      │    │   Store      │    │  calculateCompat...  │
└──────────────┘    └──────────────┘    └──────────────────────┘
                                                   │
                                                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│   Match      │◀───│   Dating     │◀───│  Compatibility       │
│   Display    │    │   Store      │    │  Results             │
└──────────────┘    └──────────────┘    └──────────────────────┘
```

---

## 3. Feature Specifications

### 3.1 User Profile System

#### Profile Data Model

```javascript
// Extended profile structure for dating
{
  id: Number,                    // Unique identifier
  
  // Birth Data (existing from birthday store)
  name: String,
  birthday: ISOString,
  gender: 'MALE' | 'FEMALE',
  coords: {
    latitude: Number,
    longitude: Number
  },
  place: String,
  
  // NEW: Dating Profile Extensions
  displayName: String,           // Public display name
  bio: String,                   // About me (max 500 chars)
  photos: [String],              // Array of base64 or URLs (max 5)
  avatarIndex: Number,           // Primary photo index
  
  interests: [String],           // Hobbies/interests tags
  lookingFor: [String],          // 'friendship', 'romance', 'spiritual-partner'
  
  // Preferences
  ageRange: {
    min: Number,
    max: Number
  },
  genderPreference: 'MALE' | 'FEMALE' | 'ANY',
  distancePreference: Number,    // km (for future geo features)
  
  // Profile Status
  isActive: Boolean,             // Profile visibility
  createdAt: ISOString,
  updatedAt: ISOString,
  
  // Computed (cached for performance)
  astrologyProfile: {
    preHeavenHexagram: Object,
    laterHeavenHexagram: Object,
    yearlyCycle: Object,
    monthlyCycle: Object,
    dailyCycle: Object,
    element: String,
    animal: String
  }
}
```

### 3.2 Matching System

#### Compatibility Score Composition

```
┌─────────────────────────────────────────────────────────────────┐
│                    OVERALL COMPATIBILITY                         │
│                         (0-100)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │  Elemental  │ │  Trigram/   │ │ Sexagenary │ │  Interest  │ │
│  │    25%      │ │  Hexagram   │ │   Cycle    │ │   Match    │ │
│  │             │ │    30%      │ │    25%     │ │    20%     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Match Display Categories

| Score Range | Category | Display |
|-------------|----------|---------|
| 80-100 | Soulmate | ☯ Gold badge |
| 60-79 | Highly Compatible | ☯ Silver badge |
| 40-59 | Compatible | ☯ Bronze badge |
| 20-39 | Challenging | ☯ Blue indicator |
| 0-19 | Learning Opportunity | ☯ Gray indicator |

### 3.3 User Interface Design

#### New Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        Sidebar Menu                              │
├─────────────────────────────────────────────────────────────────┤
│  📱 Dating (NEW SECTION)                                        │
│  ├── 👤 My Profile                                              │
│  ├── 👥 Browse Profiles                                         │
│  ├── 💕 My Matches                                              │
│  └── ⭐ Favorites                                               │
│                                                                  │
│  🔮 Consult                                                      │
│  🎵 Music                                                        │
│  ⭐ Astrology                                                    │
│  📊 Charts                                                       │
│  💑 Relationships (existing)                                    │
│  ☰ Trigrams                                                      │
│  ☰ Hexagrams                                                     │
│  ℹ️ About                                                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Profile List View Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  Browse Profiles                               [Filter] [Sort]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │  ┌────────┐          │  │  ┌────────┐          │             │
│  │  │ Photo  │  Name    │  │  │ Photo  │  Name    │             │
│  │  │        │  Age     │  │  │        │  Age     │             │
│  │  └────────┘  🐉 Dragon│  │  └────────┘  🐰 Rabbit│            │
│  │                       │  │                       │            │
│  │  ☯ 85% Match         │  │  ☯ 72% Match         │             │
│  │  ▓▓▓▓▓▓▓▓▓░          │  │  ▓▓▓▓▓▓▓░░░          │             │
│  │                       │  │                       │             │
│  │  🔥 Fire Element     │  │  🌳 Wood Element     │              │
│  │  Bio excerpt...      │  │  Bio excerpt...      │             │
│  │                       │  │                       │             │
│  │  [View] [❤️ Favorite]│  │  [View] [❤️ Favorite]│             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Plan

### Phase 1: Core Dating Infrastructure

| Task | Description | Files to Create/Modify |
|------|-------------|------------------------|
| 1.1 | Create dating profiles store | `src/stores/dating.js` |
| 1.2 | Extend birthday store for dating data | `src/stores/birthday.js` |
| 1.3 | Create profile form component | `src/components/ProfileForm.vue` |
| 1.4 | Create My Profile view | `src/views/my_profile.vue` |
| 1.5 | Update router with dating routes | `src/router/index.js` |
| 1.6 | Update App.vue navigation | `src/App.vue` |

### Phase 2: Profile Browsing & Display

| Task | Description | Files to Create/Modify |
|------|-------------|------------------------|
| 2.1 | Create ProfileCard component | `src/components/ProfileCard.vue` |
| 2.2 | Create Browse Profiles view | `src/views/dating_profiles.vue` |
| 2.3 | Create Profile Detail view | `src/views/profile_detail.vue` |
| 2.4 | Create filter/sort functionality | `src/components/ProfileFilters.vue` |

### Phase 3: Compatibility & Matching

| Task | Description | Files to Create/Modify |
|------|-------------|------------------------|
| 3.1 | Create dating compatibility utils | `src/utils/datingCompatibility.js` |
| 3.2 | Create useCompatibility composable | `src/composables/useCompatibility.js` |
| 3.3 | Create CompatibilityScore component | `src/components/CompatibilityScore.vue` |
| 3.4 | Create Matches view | `src/views/matches.vue` |
| 3.5 | Create MatchList component | `src/components/MatchList.vue` |

### Phase 4: Favorites & Polish

| Task | Description | Files to Create/Modify |
|------|-------------|------------------------|
| 4.1 | Implement favorites functionality | `src/stores/dating.js` |
| 4.2 | Create Favorites view | `src/views/favorites.vue` |
| 4.3 | Add profile import/export | `src/stores/dating.js` |
| 4.4 | Add sample profiles for demo | `src/const/sampleProfiles.js` |
| 4.5 | UI polish and responsive design | Various CSS updates |

---

## 5. Detailed Component Specifications

### 5.1 Dating Store (`src/stores/dating.js`)

```javascript
// Store structure outline
{
  state: {
    profiles: [],           // All dating profiles
    currentUserProfile: {}, // Logged-in user's profile
    favorites: [],          // IDs of favorited profiles
    calculatedMatches: [],  // Cached compatibility results
    filters: {
      ageRange: [18, 99],
      gender: 'ANY',
      elements: [],
      minCompatibility: 0
    },
    sortBy: 'compatibility' // 'compatibility', 'age', 'recent'
  },
  
  actions: {
    // Profile Management
    createProfile(profileData),
    updateProfile(id, updates),
    deleteProfile(id),
    getProfileById(id),
    
    // Favorites
    toggleFavorite(profileId),
    getFavorites(),
    
    // Matching
    calculateAllMatches(userProfileId),
    getTopMatches(limit),
    
    // Demo Data
    loadSampleProfiles(),
    
    // Persistence
    exportProfiles(),
    importProfiles(file)
  },
  
  getters: {
    filteredProfiles,
    sortedProfiles,
    matchesWithScores,
    favoriteProfiles
  }
}
```

### 5.2 Compatibility Composable (`src/composables/useCompatibility.js`)

```javascript
// Composable structure
export function useCompatibility() {
  // Calculate compatibility between two profiles
  function calculateCompatibility(profile1, profile2) {
    // Uses existing astrology.calculateCompatibilityByYear
    // Returns: { overallScore, breakdown, description }
  }
  
  // Get detailed compatibility report
  function getDetailedReport(profile1, profile2) {
    // Returns: Extended analysis including:
    // - Element interaction description
    // - Trigram harmony analysis  
    // - Best periods for relationship
    // - Potential challenges
  }
  
  // Batch calculate for profile list
  function calculateBatchCompatibility(userProfile, profileList) {
    // Returns sorted list with scores
  }
  
  return {
    calculateCompatibility,
    getDetailedReport,
    calculateBatchCompatibility
  }
}
```

### 5.3 New Routes

```javascript
// Routes to add to src/router/index.js
{
  path: '/dating',
  name: 'Dating',
  component: () => import('../views/dating_profiles.vue'),
},
{
  path: '/my-profile',
  name: 'MyProfile',
  component: () => import('../views/my_profile.vue'),
},
{
  path: '/profile/:id',
  name: 'ProfileDetail',
  component: () => import('../views/profile_detail.vue'),
},
{
  path: '/matches',
  name: 'Matches',
  component: () => import('../views/matches.vue'),
},
{
  path: '/favorites',
  name: 'Favorites',
  component: () => import('../views/favorites.vue'),
}
```

---

## 6. Sample Data Strategy

For the MVP demo version, include pre-loaded sample profiles:

```javascript
// src/const/sampleProfiles.js
export const sampleProfiles = [
  {
    id: 1001,
    displayName: 'Luna',
    birthday: '1990-03-21T14:30:00',
    gender: 'FEMALE',
    bio: 'Meditation enthusiast seeking mindful connection...',
    interests: ['Meditation', 'Yoga', 'Astrology', 'Nature'],
    lookingFor: ['spiritual-partner', 'romance'],
    // ... complete profile
  },
  // 10-15 diverse sample profiles with various:
  // - Zodiac animals (Dragon, Rabbit, Tiger, etc.)
  // - Elements (Wood, Fire, Earth, Metal, Water)
  // - Ages and genders
  // - Interest combinations
];
```

---

## 7. Future Enhancement Roadmap

### Phase 2: Backend Integration (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Future Backend Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Vue.js    │───▶│   Firebase  │◀───│   Firebase Auth     │ │
│  │   Frontend  │    │   Firestore │    │   (email/social)    │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐                              │
│                     │   Cloud     │                              │
│                     │   Functions │                              │
│                     │   (matching)│                              │
│                     └─────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Planned Future Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Real-time Messaging | In-app chat between matched profiles | High |
| Geolocation | Distance-based filtering | Medium |
| Push Notifications | Match alerts, messages | Medium |
| Video Profiles | Short intro videos | Low |
| Daily Compatibility | Daily pairing recommendations | Medium |
| Group Matching | Find compatible friend groups | Low |

---

## 8. File Structure Summary

### New Files to Create

```
src/
├── stores/
│   └── dating.js                 # Dating profiles store
├── views/
│   ├── dating_profiles.vue       # Browse all profiles
│   ├── my_profile.vue            # User's own profile
│   ├── profile_detail.vue        # Single profile view
│   ├── matches.vue               # Compatibility matches
│   └── favorites.vue             # Favorited profiles
├── components/
│   ├── ProfileCard.vue           # Profile card display
│   ├── ProfileForm.vue           # Profile creation/edit form
│   ├── ProfileFilters.vue        # Filter controls
│   ├── CompatibilityScore.vue    # Score display component
│   ├── MatchList.vue             # List of matches
│   └── FavoriteButton.vue        # Favorite toggle button
├── composables/
│   └── useCompatibility.js       # Compatibility calculation composable
├── utils/
│   └── datingCompatibility.js    # Extended compatibility functions
└── const/
    └── sampleProfiles.js         # Demo sample profiles
```

### Files to Modify

```
src/
├── router/
│   └── index.js                  # Add dating routes
├── App.vue                       # Add Dating menu section
└── assets/scss/
    └── app.scss                  # Add dating-specific styles
```

---

## 9. Technical Considerations

### 9.1 Performance

- **Lazy Loading**: Use dynamic imports for dating views
- **Computed Caching**: Cache compatibility calculations in store
- **Image Optimization**: Compress profile photos before storage
- **Debounced Filters**: Prevent excessive re-renders on filter changes

### 9.2 Data Storage Limits

- localStorage limit: ~5MB per domain
- Photo storage: Use compressed base64 (max 100KB per image)
- Profile limit for demo: ~50 profiles maximum
- Consider IndexedDB for larger datasets in future

### 9.3 Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Color contrast compliance for score displays
- Screen reader friendly profile cards

---

## 10. Success Criteria

### MVP Completion Checklist

- [ ] User can create and edit their dating profile
- [ ] User can upload/manage profile photos
- [ ] User can browse other profiles in a list view
- [ ] User can view detailed profile with compatibility score
- [ ] User can see breakdown of compatibility factors
- [ ] User can favorite/unfavorite profiles
- [ ] User can filter profiles by basic criteria
- [ ] User can sort profiles by compatibility score
- [ ] Sample profiles load for demo purposes
- [ ] All data persists in localStorage
- [ ] Responsive design works on mobile/tablet

---

## Appendix A: Element Compatibility Reference

| Element 1 | Element 2 | Relationship | Score Impact |
|-----------|-----------|--------------|--------------|
| Wood | Fire | Generating | +3 |
| Fire | Earth | Generating | +3 |
| Earth | Metal | Generating | +3 |
| Metal | Water | Generating | +3 |
| Water | Wood | Generating | +3 |
| Wood | Earth | Controlling | -2 |
| Fire | Metal | Controlling | -2 |
| Earth | Water | Controlling | -2 |
| Metal | Wood | Controlling | -2 |
| Water | Fire | Controlling | -2 |
| Same | Same | Harmonious | +1 |

---

## Appendix B: Chinese Zodiac Compatibility Matrix

```
        Rat Ox Tig Rab Dra Sna Hor Got Mon Roo Dog Pig
Rat     ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐
Ox      ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐
Tiger   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐
Rabbit  ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●
Dragon  ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐
Snake   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐
Horse   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐
Goat    ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●
Monkey  ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐
Rooster ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐
Dog     ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐
Pig     ◐   ◐   ◐   ●   ◐   ◐   ◐   ●   ◐   ◐   ◐   ●

● = Highly Compatible (Trine)
◐ = Varies (check element interaction)
```

---

*Document Version: 1.0*  
*Created: 2026-03-10*  
*Author: Architecture Mode*
