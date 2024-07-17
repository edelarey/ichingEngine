const { DateTime } = require('luxon');
const SunCalc = require('suncalc');

/** The following is based on The Astrology of I Ching by W.A. Sherrill and W.K. Chu, Routledge and Keegan Paul, 1976 */


class CelestialStem {
  constructor(name, element, charge, aspect, aspectNumber, oppositeAspect) {
    this.name = name;
    this.element = element;
    this.charge = charge;
    this.aspect = aspect;
    this.aspectNumber = aspectNumber;
    this.oppositeAspect = oppositeAspect;
  }

  getName() {
    return this.name;
  }

  getElement() {
    return this.element;
  }

  getCharge() {
    return this.charge;
  }

  getAspect() {
    return this.aspect;
  }

  getAspectNumber() {
    return this.aspectNumber;
  }

  getoppositeAspect() {
    return this.oppositeAspect;
  }


}

class HoraryBranch {
  constructor(name, englishName, chineseName, animalSign,  relatedStems) {
    this.name = name;
    this.englishName = englishName;
    this.chineseName = chineseName;
    this.animalSign = animalSign;
    this.relatedStems = relatedStems;
  }

  getEnglishName() {
    return this.englishName;
  }

  getChineseName() {
    return this.chineseName;
  }

  getAnimalSign() {
    return this.animalSign;
  }
  
  getRelatedStems() {
    return this.relatedStems;
  }
}

class IChingAstrology {
  constructor() {
    this.celestialStems = [
      new CelestialStem('Jia', 'Wood',   'Yang', '木 (Mù) Yang',  'A', 6, 'B'),
      new CelestialStem('Yi',  'Wood',   'Yin',  '木 (Mù) Yin',   'B', 2, 'A'),
      new CelestialStem('Bing', 'Fire',  'Yang', '火 (Huǒ) Yang', 'C', 8, 'D'),
      new CelestialStem('Ding', 'Fire',  'Yin',  '火 (Huǒ) Yin',  'D', 7, 'C'), 
      new CelestialStem('Wu',   'Earth', 'Yang', '土 (Tǔ) Yang',  'E', 1, 'F'),
      new CelestialStem('Ji',   'Earth', 'Yin',  '土 (Tǔ) Yin',   'F', 9, 'E'),
      new CelestialStem('Geng', 'Metal', 'Yang', '金 (Jīn) Yang', 'G', 5, 'H'),
      new CelestialStem('Xin',  'Metal', 'Yin',  '金 (Jīn) Yin',  'H', 4, 'G'),
      new CelestialStem('Ren',  'Water', 'Yang', '水 (Shuǐ) Yang','I', 6, 'J'),
      new CelestialStem('Gui',  'Water', 'Yin',  '水 (Shuǐ) Yin', 'J', 2, 'I') 
    ];
    this.horaryBranches = [
      new HoraryBranch('Zi', 'Rat', '子 (Zǐ)', 'Rat', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('Chou', 'Ox', '丑 (Chǒu)', 'Ox', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui']),
      new HoraryBranch('Yin', 'Tiger', '寅 (Yín)', 'Tiger', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('Mao', 'Rabbit', '卯 (Mǎo)', 'Rabbit', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui']),
      new HoraryBranch('Chen', 'Dragon', '辰 (Chén)', 'Dragon', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('Si', 'Snake', '巳 (Sì)', 'Snake', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui']),
      new HoraryBranch('Wu', 'Horse', '午 (Wǔ)', 'Horse', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('Wei', 'Goat', '未 (Wèi)', 'Goat', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui']),
      new HoraryBranch('Shen', 'Monkey', '申 (Shēn)', 'Monkey', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('You', 'Rooster', '酉 (Yǒu)', 'Rooster', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui']),
      new HoraryBranch('Xu', 'Dog', '戌 (Xū)', 'Dog', ['Jia', 'Bing', 'Wu', 'Geng', 'Ren']),
      new HoraryBranch('Hai', 'Pig', '亥 (Hài)', 'Pig', ['Yi', 'Ding', 'Ji', 'Xin', 'Gui'])
    ];

    this.linkages = [
      { stem: 'Jia', branch: 'Zi' },
      { stem: 'Yi', branch: 'Chou' },
      { stem: 'Bing', branch: 'Yin' },
      { stem: 'Ding', branch: 'Mao' },
      { stem: 'Wu', branch: 'Chen' },
      { stem: 'Ji', branch: 'Si' },
      { stem: 'Geng', branch: 'Wu' },
      { stem: 'Xin', branch: 'Wei' },
      { stem: 'Ren', branch: 'Shen' },
      { stem: 'Gui', branch: 'You' },
      { stem: 'Jia', branch: 'Xu' },
      { stem: 'Yi', branch: 'Hai' },
      { stem: 'Bing', branch: 'Zi' },
      { stem: 'Ding', branch: 'Chou' },
      { stem: 'Wu', branch: 'Yin' },
      { stem: 'Ji', branch: 'Mao' },
      { stem: 'Geng', branch: 'Chen' },
      { stem: 'Xin', branch: 'Si' },
      { stem: 'Ren', branch: 'Wu' },
      { stem: 'Gui', branch: 'Wei' },
      { stem: 'Jia', branch: 'Shen' },
      { stem: 'Yi', branch: 'You' },
      { stem: 'Bing', branch: 'Xu' },
      { stem: 'Ding', branch: 'Hai' },
      { stem: 'Wu', branch: 'Zi' },
      { stem: 'Ji', branch: 'Chou' },
      { stem: 'Geng', branch: 'Yin' },
      { stem: 'Xin', branch: 'Mao' },
      { stem: 'Ren', branch: 'Chen' },
      { stem: 'Gui', branch: 'Si' },
      { stem: 'Jia', branch: 'Wu' },
      { stem: 'Yi', branch: 'Wei' },
      { stem: 'Bing', branch: 'Shen' },
      { stem: 'Ding', branch: 'You' },
      { stem: 'Wu', branch: 'Xu' },
      { stem: 'Ji', branch: 'Hai' },
      { stem: 'Geng', branch: 'Zi' },
      { stem: 'Xin', branch: 'Chou' },
      { stem: 'Ren', branch: 'Yin' },
      { stem: 'Gui', branch: 'Mao' },
      { stem: 'Jia', branch: 'Chen' },
      { stem: 'Yi', branch: 'Si' },
      { stem: 'Bing', branch: 'Wu' },
      { stem: 'Ding', branch: 'Wei' },
      { stem: 'Wu', branch: 'Shen' },
      { stem: 'Ji', branch: 'You' },
      { stem: 'Geng', branch: 'Xu' },
      { stem: 'Xin', branch: 'Hai' },
      { stem: 'Ren', branch: 'Zi' },
      { stem: 'Gui', branch: 'Chou' }
    ];
    
  }

  getCelestialStem(name) {
    return this.celestialStems.find(stem => stem.name === name);
  }

  getAllCelestialStems() {
    return this.celestialStems;
  }
  
  getHoraryBranch(name) {
    return this.horaryBranches.find(branch => branch.name === name);
  }

  getAllHoraryBranches() {
    return this.horaryBranches;
  }
}






const hexagramAstrology = {
  // Wood Stem
  WoodRat: {
    position: 1,
    english: 'Qian (Heaven)',
    chinese: '乾',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rat',
  },
  WoodOx: {
    position: 2,
    english: 'Kun (Earth)',
    chinese: '坤',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Ox',
  },
  WoodTiger: {
    position: 3,
    english: 'Chun (Difficulty at the Beginning)',
    chinese: '屯',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Tiger',
  }, 
  // Wood Stem
  WoodDragon: {
    position: 4,
    english: 'Meng (Youthful Folly)',
    chinese: '蒙',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dragon',
  },
  WoodSnake: {
    position: 5,
    english: 'Xu (Waiting)',
    chinese: '需',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Snake',
  },
  WoodHorse: {
    position: 6,
    english: 'Xian (Conflict)',
    chinese: '咸',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Horse',
  },
  WoodGoat: {
    position: 7,
    english: 'Dun (The Army)',
    chinese: '遁',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Goat',
  },
  WoodMonkey: {
    position: 8,
    english: 'Pi (Standstill)',
    chinese: '否',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Monkey',
  },
  WoodRooster: {
    position: 9,
    english: 'Zhong Fu (Inner Truth)',
    chinese: '中孚',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rooster',
  },
  WoodDog: {
    position: 10,
    english: 'Lu (The Wanderer)',
    chinese: '旅',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dog',
  },
  WoodPig: {
    position: 11,
    english: 'Da Guo (The Taming Power of the Great)',
    chinese: '大过',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Pig',
  },

  // Fire Stem
  FireRat: {
    position: 12,
    english: 'Qian (Heaven)',
    chinese: '乾',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Rat',
  },
  FireOx: {
    position: 13,
    english: 'Kun (Earth)',
    chinese: '坤',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Ox',
  },
  FireTiger: {
    position: 14,
    english: 'Chun (Difficulty at the Beginning)',
    chinese: '屯',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Tiger',
  },
  FireDragon: {
    position: 15,
    english: 'Meng (Youthful Folly)',
    chinese: '蒙',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Dragon',
  },
  FireSnake: {
    position: 16,
    english: 'Xu (Waiting)',
    chinese: '需',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Snake',
  },
  FireHorse: {
    position: 17,
    english: 'Xian (Conflict)',
    chinese: '咸',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Horse',
  },
  FireGoat: {
    position: 18,
    english: 'Dun (The Army)',
    chinese: '遁',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Goat',
  },
  FireMonkey: {
    position: 19,
    english: 'Pi (Standstill)',
    chinese: '否',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Monkey',
  },
  FireRooster: {
    position: 20,
    english: 'Zhong Fu (Inner Truth)',
    chinese: '中孚',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Rooster',
  },
  FireDog: {
    position: 21,
    english: 'Lu (The Wanderer)',
    chinese: '旅',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Dog',
  },
  FirePig: {
    position: 22,
    english: 'Da Guo (The Taming Power of the Great)',
    chinese: '大过',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Pig',
  },

  // Earth Stem
  EarthRat: {
    position: 23,
    english: 'Qian (Heaven)',
    chinese: '乾',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Rat',
  },
  EarthOx: {
    position: 24,
    english: 'Kun (Earth)',
    chinese: '坤',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Ox',
  },
  EarthTiger: {
    position: 25,
    english: 'Chun (Difficulty at the Beginning)',
    chinese: '屯',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Tiger',
  },
  EarthDragon: {
    position: 26,
    english: 'Meng (Youthful Folly)',
    chinese: '蒙',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Dragon',
  },
  EarthSnake: {
    position: 27,
    english: 'Xu (Waiting)',
    chinese: '需',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Snake',
  },
  EarthHorse: {
    position: 28,
    english: 'Xian (Conflict)',
    chinese: '咸',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Horse',
  },
  EarthGoat: {
    position: 29,
    english: 'Dun (The Army)',
    chinese: '遁',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Goat',
  },
  EarthMonkey: {
    position: 30,
    english: 'Pi (Standstill)',
    chinese: '否',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Monkey',
  },
  EarthRooster: {
    position: 31,
    english: 'Zhong Fu (Inner Truth)',
    chinese: '中孚',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Rooster',
  },
  EarthDog: {
    position: 32,
    english: 'Lu (The Wanderer)',
    chinese: '旅',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Dog',
  },
  EarthPig: {
    position: 33,
    english: 'Da Guo (The Taming Power of the Great)',
    chinese: '大过',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Pig',
  },

  // Metal Stem
  MetalRat: {
    position: 34,
    english: 'Qian (Heaven)',
    chinese: '乾',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Rat',
  },
  MetalOx: {
    position: 35,
    english: 'Kun (Earth)',
    chinese: '坤',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Ox',
  },
  MetalTiger: {
    position: 36,
    english: 'Chun (Difficulty at the Beginning)',
    chinese: '屯',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Tiger',
  },
  MetalDragon: {
    position: 37,
    english: 'Meng (Youthful Folly)',
    chinese: '蒙',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Dragon',
  },
  MetalSnake: {
    position: 38,
    english: 'Xu (Waiting)',
    chinese: '需',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Snake',
  },
  MetalHorse: {
    position: 39,
    english: 'Xian (Conflict)',
    chinese: '咸',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Horse',
  },
  MetalGoat: {
    position: 40,
    english: 'Dun (The Army)',
    chinese: '遁',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Goat',
  },
  MetalMonkey: {
    position: 41,
    english: 'Pi (Standstill)',
    chinese: '否',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Monkey',
  },
  MetalRooster: {
    position: 42,
    english: 'Zhong Fu (Inner Truth)',
    chinese: '中孚',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Rooster',
  },
  MetalDog: {
    position: 43,
    english: 'Lu (The Wanderer)',
    chinese: '旅',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Dog',
  },
  MetalPig: {
    position: 44,
    english: 'Da Guo (The Taming Power of the Great)',
    chinese: '大过',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Pig',
  },

  // Water Stem
  WaterRat: {
    position: 45,
    english: 'Qian (Heaven)',
    chinese: '乾',
    heavenlyStem: 'Water',
    earthlyBranch: 'Rat',
  },
  WaterOx: {
    position: 46,
    english: 'Kun (Earth)',
    chinese: '坤',
    heavenlyStem: 'Water',
    earthlyBranch: 'Ox',
  },
  WaterTiger: {
    position: 47,
    english: 'Chun (Difficulty at the Beginning)',
    chinese: '屯',
    heavenlyStem: 'Water',
    earthlyBranch: 'Tiger',
  },
  WaterDragon: {
    position: 48,
    english: 'Meng (Youthful Folly)',
    chinese: '蒙',
    heavenlyStem: 'Water',
    earthlyBranch: 'Dragon',
  },
  WaterSnake: {
    position: 49,
    english: 'Xu (Waiting)',
    chinese: '需',
    heavenlyStem: 'Water',
    earthlyBranch: 'Snake',
  },
  WaterHorse: {
    position: 50,
    english: 'Xian (Conflict)',
    chinese: '咸',
    heavenlyStem: 'Water',
    earthlyBranch: 'Horse',
  },
  WaterGoat: {
    position: 51,
    english: 'Dun (The Army)',
    chinese: '遁',
    heavenlyStem: 'Water',
    earthlyBranch: 'Goat',
  },
  WaterMonkey: {
    position: 52,
    english: 'Pi (Standstill)',
    chinese: '否',
    heavenlyStem: 'Water',
    earthlyBranch: 'Monkey',
  },
  WaterRooster: {
    position: 53,
    english: 'Zhong Fu (Inner Truth)',
    chinese: '中孚',
    heavenlyStem: 'Water',
    earthlyBranch: 'Rooster',
  },
  WaterDog: {
    position: 54,
    english: 'Lu (The Wanderer)',
    chinese: '旅',
    heavenlyStem: 'Water',
    earthlyBranch: 'Dog',
  },
  WaterPig: {
    position: 55,
    english: 'Da Guo (The Taming Power of the Great)',
    chinese: '大过',
    heavenlyStem: 'Water',
    earthlyBranch: 'Pig',
  },
  WoodRat: {
    position: 56,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rat',
  },
  WoodOx: {
    position: 57,
    english: 'Ji Ji (The Clinging)',
    chinese: '震',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Ox',
  },
  WoodTiger: {
    position: 58,
    english: 'Sun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Tiger',
  },
  WoodDragon: {
    position: 59,
    english: 'Tai (Peace)',
    chinese: '太',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dragon',
  },
  WoodSnake: {
    position: 60,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Snake',
  },
  WoodHorse: {
    position: 61,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Horse',
  },
  WoodGoat: {
    position: 62,
    english: 'Chen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Goat',
  },
  WoodMonkey: {
    position: 63,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Monkey',
  },
  WoodRooster: {
    position: 64,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rooster',
  },
  WoodDog: {
    position: 65,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dog',
  },
  WoodPig: {
    position: 66,
    english: 'Zhen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Pig',
  },

  // Fire Stem (continued)
  FireRat: {
    position: 67,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Rat',
  },
  FireOx: {
    position: 68,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Ox',
  },
  FireTiger: {
    position: 69,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Tiger',
  },
  FireDragon: {
    position: 70,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Dragon',
  },
  FireSnake: {
    position: 71,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Snake',
  },
  FireHorse: {
    position: 72,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Horse',
  },
  FireGoat: {
    position: 73,
    english: 'Zhen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Goat',
  },
  FireMonkey: {
    position: 74,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Monkey',
  },
  FireRooster: {
    position: 75,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Rooster',
  },
  FireDog: {
    position: 76,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Dog',
  },
  FirePig: {
    position: 77,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Fire',
    earthlyBranch: 'Pig',
  },

  // Earth Stem (continued)
  EarthRat: {
    position: 78,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Rat',
  },
  EarthOx: {
    position: 79,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Ox',
  },
  EarthTiger: {
    position: 80,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Tiger',
  },
  EarthDragon: {
    position: 81,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Dragon',
  },
  EarthSnake: {
    position: 82,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Snake',
  },
  EarthHorse: {
    position: 83,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Horse',
  },
  EarthGoat: {
    position: 84,
    english: 'Zhen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Goat',
  },
  EarthMonkey: {
    position: 85,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Monkey',
  },
  EarthRooster: {
    position: 86,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Rooster',
  },
  EarthDog: {
    position: 87,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Dog',
  },
  EarthPig: {
    position: 88,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Earth',
    earthlyBranch: 'Pig',
  },

  // Metal Stem (continued)
  MetalRat: {
    position: 89,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Rat',
  },
  MetalOx: {
    position: 90,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Ox',
  },
  MetalTiger: {
    position: 91,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Tiger',
  },
  MetalDragon: {
    position: 92,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Dragon',
  },
  MetalSnake: {
    position: 93,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Snake',
  },
  MetalHorse: {
    position: 94,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Horse',
  },
  MetalGoat: {
    position: 95,
    english: 'Zhen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Goat',
  },
  MetalMonkey: {
    position: 96,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Monkey',
  },
  MetalRooster: {
    position: 97,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Rooster',
  },
  MetalDog: {
    position: 98,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Dog',
  },
  MetalPig: {
    position: 99,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Metal',
    earthlyBranch: 'Pig',
  },

  // Water Stem (continued)
  WaterRat: {
    position: 100,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Water',
    earthlyBranch: 'Rat',
  },
  
  WaterOx: {
    position: 101,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Water',
    earthlyBranch: 'Ox',
  },
  WaterTiger: {
    position: 102,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Water',
    earthlyBranch: 'Tiger',
  },
  WaterDragon: {
    position: 103,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Water',
    earthlyBranch: 'Dragon',
  },
  WaterSnake: {
    position: 104,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Water',
    earthlyBranch: 'Snake',
  },
  WaterHorse: {
    position: 105,
    english: 'Xun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Water',
    earthlyBranch: 'Horse',
  },
  WaterGoat: {
    position: 106,
    english: 'Zhen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Water',
    earthlyBranch: 'Goat',
  },
  WaterMonkey: {
    position: 107,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Water',
    earthlyBranch: 'Monkey',
  },
  WaterRooster: {
    position: 108,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Water',
    earthlyBranch: 'Rooster',
  },
  WaterDog: {
    position: 109,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Water',
    earthlyBranch: 'Dog',
  },
  WaterPig: {
    position: 110,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Water',
    earthlyBranch: 'Pig',
  },

  // Wood Stem (continued)
  WoodRat: {
    position: 111,
    english: 'Dui (The Joyous)',
    chinese: '兑',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rat',
  },
  WoodOx: {
    position: 112,
    english: 'Ji Ji (The Clinging)',
    chinese: '震',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Ox',
  },
  WoodTiger: {
    position: 113,
    english: 'Sun (The Gentle)',
    chinese: '巽',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Tiger',
  },
  WoodDragon: {
    position: 114,
    english: 'Tai (Peace)',
    chinese: '太',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dragon',
  },
  WoodSnake: {
    position: 115,
    english: 'Qian (The Creative)',
    chinese: '乾',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Snake',
  },
  WoodHorse: {
    position: 116,
    english: 'Kun (The Receptive)',
    chinese: '坤',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Horse',
  },
  WoodGoat: {
    position: 117,
    english: 'Chen (The Arousing)',
    chinese: '震',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Goat',
  },
  WoodMonkey: {
    position: 118,
    english: 'Gen (Keeping Still)',
    chinese: '艮',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Monkey',
  },
  WoodRooster: {
    position: 119,
    english: 'Kan (The Abysmal)',
    chinese: '坎',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Rooster',
  },
  WoodDog: {
    position: 120,
    english: 'Li (The Clinging)',
    chinese: '离',
    heavenlyStem: 'Wood',
    earthlyBranch: 'Dog',
  },
};

async function getSolarTerm(date, latitude) {

  const isNorthernHemisphere = latitude >= 0;

  const solarTerms = [
    { english: 'Start of Spring', chinese: '立春' }, { english: 'Rain Water', chinese: '雨水' },
    { english: 'Awakening of Insects', chinese: '惊蛰' }, { english: 'Vernal Equinox', chinese: '春分' },
    { english: 'Pure Brightness', chinese: '清明' }, { english: 'Grain Rain', chinese: '谷雨' },
    { english: 'Start of Summer', chinese: '立夏' }, { english: 'Grain Full', chinese: '小满' },
    { english: 'Grain in Ear', chinese: '芒种' }, { english: 'Summer Solstice', chinese: '夏至' },
    { english: 'Slight Heat', chinese: '小暑' }, { english: 'Great Heat', chinese: '大暑' },
    { english: 'Start of Autumn', chinese: '立秋' }, { english: 'Limit of Heat', chinese: '处暑' },
    { english: 'White Dew', chinese: '白露' }, { english: 'Autumnal Equinox', chinese: '秋分' },
    { english: 'Cold Dew', chinese: '寒露' }, { english: 'Frost Descent', chinese: '霜降' },
    { english: 'Start of Winter', chinese: '立冬' }, { english: 'Minor Snow', chinese: '小雪' },
    { english: 'Major Snow', chinese: '大雪' }, { english: 'Winter Solstice', chinese: '冬至' },
    { english: 'Minor Cold', chinese: '小寒' }, { english: 'Major Cold', chinese: '大寒' }
  ];

  const year = date.year;
  const month = date.month;
  const day = date.day;

  // Calculate the day of the year
  const dayOfYear = date.diff(DateTime.fromObject({ year, month: 1, day: 1 }), 'days').days + 1;

  // Adjust for the southern hemisphere
  const hemisphereAdjustment = isNorthernHemisphere ? 0 : 180;
  const adjustedDayOfYear = dayOfYear + hemisphereAdjustment;

  // Calculate the solar term based on the day of the year
  const solarTermIndex = Math.floor((adjustedDayOfYear - 1) / (365 / solarTerms.length));
  return solarTerms[solarTermIndex];
};

// Function to compute the sexagenary cycle as an array

async function determineSubCycle(birthDate, birthTime) {
  const birthDateTime = DateTime.fromFormat(`${birthDate} ${birthTime}`, 'yyyy-MM-dd HH:mm');

  const upperCycleStart = DateTime.fromObject({ year: 1924, month: 2, day: 5 }); // Upper cycle starts on Jia Zi
  const lowerCycleStart = DateTime.fromObject({ year: 1984, month: 2, day: 4 }); // Lower cycle starts on Jia Zi
  const middleCycleStart = DateTime.fromObject({ year: 1952, month: 2, day: 6 }); // Middle cycle starts on Bing Yin

  // Calculate the year difference for any date
  const yearDiff = birthDateTime.year - 4;

  if (birthDateTime < upperCycleStart) {
    return 'Upper';
  } else if (birthDateTime >= upperCycleStart && birthDateTime < lowerCycleStart) {
    // Check if the year difference is a multiple of 60, indicating a full sexagenary cycle
    return yearDiff % 60 === 0 ? 'Upper' : 'Middle';
  } else {
    // Check if the year difference is a multiple of 60, indicating a full sexagenary cycle
    return yearDiff % 60 === 0 ? 'Lower' : 'Middle';
  }
};

// // Example usage
// const birthDate = '1990-01-01';
// const birthTime = '12:00';

// const birthDateTime = DateTime.fromFormat(`${birthDate} ${birthTime}`, 'yyyy-MM-dd HH:mm');

// const sexagenaryCycleArray = computeSexagenaryCycle(birthDate, birthTime);
// const subCycle = determineSubCycle(birthDateTime);

// console.log('Sexagenary Cycle Array:', sexagenaryCycleArray);
// console.log('Sub-Cycle:', subCycle);

// Function to calculate true local time
async function calculateTrueLocalTime(birthDate, birthTime, latitude, longitude) {
  // Combine birth date and time
  const birthDateTime = DateTime.fromFormat(`${birthDate} ${birthTime}`, 'yyyy-MM-dd HH:mm');

  // Calculate the time zone offset for the provided coordinates
  const timeZoneOffset = birthDateTime.offset;

  // Calculate the solar noon for the given coordinates
  const solarNoon = SunCalc.getTimes(birthDateTime.toJSDate(), latitude, longitude).solarNoon;  
  
  // Calculate the difference between solar noon and midnight
  const solarNoonOffset = DateTime.fromJSDate(solarNoon).diff(birthDateTime);

  // Calculate true local time by adjusting birth time with solar noon offset and time zone offset
  const trueLocalTime = birthDateTime.plus(solarNoonOffset).minus({ minutes: timeZoneOffset });

  return trueLocalTime.toFormat('yyyy-MM-dd HH:mm:ss');
};

// Function to compute the sexagenary cycle
async function computeSexagenaryCycle(trueBirthDateTime) {
  // Combine birth date and time
  const birthDateTime = DateTime.fromJSDate(new Date(trueBirthDateTime));
 
  // Define heavenly stems and earthly branches in English and Chinese
  const heavenlyStems = [
    { english: 'Wood', chinese: '甲' }, { english: 'Fire', chinese: '乙' },
    { english: 'Earth', chinese: '丙' }, { english: 'Metal', chinese: '丁' },
    { english: 'Water', chinese: '戊' }, { english: 'Wood', chinese: '己' },
    { english: 'Fire', chinese: '庚' }, { english: 'Earth', chinese: '辛' },
    { english: 'Metal', chinese: '壬' }, { english: 'Water', chinese: '癸' }
  ];

  const earthlyBranches = [
    { english: 'Rat', chinese: '子' }, { english: 'Ox', chinese: '丑' },
    { english: 'Tiger', chinese: '寅' }, { english: 'Rabbit', chinese: '卯' },
    { english: 'Dragon', chinese: '辰' }, { english: 'Snake', chinese: '巳' },
    { english: 'Horse', chinese: '午' }, { english: 'Goat', chinese: '未' },
    { english: 'Monkey', chinese: '申' }, { english: 'Rooster', chinese: '酉' },
    { english: 'Dog', chinese: '戌' }, { english: 'Pig', chinese: '亥' }
  ];

  // Calculate the position in the sexagenary cycle
  const yearDiff = birthDateTime.year - 4; // The sexagenary cycle starts with Jia Zi (year 1)
  const heavenlyStemPosition = (yearDiff % 10 + 10) % 10; // Ensure a positive result
  const earthlyBranchPosition = (yearDiff % 12 + 12) % 12; // Ensure a positive result

  // Create an object representing the sexagenary cycle with English and Chinese names
  const sexagenaryCycle = {
    heavenlyStem: heavenlyStems[heavenlyStemPosition],
    earthlyBranch: earthlyBranches[earthlyBranchPosition],
  };

  return sexagenaryCycle;
};

// getNatalHexagram
async function calculateNatalHexagram(birthDate, birthTime) {

  
  const sexagenaryCycle = await this.computeSexagenaryCycle(birthDate, birthTime);
  const subCycle = await this.determineSubCycle(birthDate, birthTime);
  console.log('sexagenaryCycle', sexagenaryCycle.earthlyBranch, sexagenaryCycle.heavenlyStem, subCycle);
  const heavenlyStem = sexagenaryCycle.heavenlyStem.english;
  const earthlyBranch = sexagenaryCycle.earthlyBranch.english;
  // find the correct hexagram buy searching for the heavenlyStem and earthlyBranch in the hexagram const
  let hex = _.find(hexagramAstrology, { heavenlyStem: heavenlyStem, earthlyBranch: earthlyBranch });

  return hex;
};


export default {
  hexagramAstrology,
  calculateTrueLocalTime,
  getSolarTerm,
  determineSubCycle,
  computeSexagenaryCycle,
  calculateNatalHexagram
  
}