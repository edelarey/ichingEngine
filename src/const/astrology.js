const { DateTime } = require('luxon');
const SunCalc = require('suncalc');
import { name } from 'vue-slide-bar';
import bagua from '../const/bagua';
import hexagram from './hexagram';
import yao from './yao';
const Color = require("color");




/** The following is based on The Astrology of I Ching by W.A. Sherrill and W.K. Chu, Routledge and Keegan Paul, 1976 */

/** Ho Lo Li Shu - Ho Map Lo Map Rational Number (W.K. Chu, 1993, p.8) */
const hoMap = {
  Wood: {
    order: 1,       
    numbers: [3, 8],  
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'liver',
    direction: bagua.compassDirection.East,
    color: Color.rgb(	0, 255, 0), // Green
    },
  Fire: {
    order: 2,           
    numbers: [2, 7],
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'heart',
    direction: bagua.compassDirection.South,
    color: Color.rgb(	255, 0, 0), // Red
  },
  Earth: {
    order: 3,   
    numbers: [5, 5],  // 1, 9 = 5 + 5 = 10 
    polarity: [yao.yao.yin, yao.yao.yang],
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0), // Yellow
    direction: bagua.compassDirection.Center,
  },
  Metal: {
    order: 4,    
    numbers: [4, 9],
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255), // White
    direction: bagua.compassDirection.West,
  },
  Water: {
    order: 5,   
    polarity: [yao.yao.yin, yao.yao.yang],
    numbers: [1, 6],
    bodyPart: 'kidneys',
    color: Color.rgb(	0, 0, 0), // Black
    direction: bagua.compassDirection.North,
  }    
};



/** Elements in Relation to Celestial Stems Fu Hsi's Later Heaven Sequence
 * Order shows the manner of one element generating another in the cycle of the seasons
 * The order of the elements is Wood, Fire, Earth, Metal, Water and then back to Wood
 * Represents Earthly Manifestation of the Elements
*/

/** LoMap = Later Heaven Sequence Of Trigrams AND the Magic Square Of Three
 * (W.K. Chu, 1993, p.12)
 */
const magicSquareOfThree =
  [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

const laterHeavenElements = {
  Wood: {
    order: 1,       
    trigrams: [bagua.bagua.zhèn, bagua.bagua.gèn],
    numbers: [3, 8],
    bodyPart: 'liver',
    direction: bagua.compassDirection.East,
    color: Color.rgb(	0, 255, 0),
    },
  Fire: {
    order: 2,       
    trigrams: [bagua.bagua.kūn, bagua.bagua.duì],  
    numbers: [2, 7],
    bodyPart: 'heart',
    direction: bagua.compassDirection.South,
    color: Color.rgb(	255, 0, 0),
  },
  Earth: {
    order: 3,
    trigrams: [bagua.bagua.kǎn, bagua.bagua.lí],    // (1, 9 = 5 + 5 = 10 )
    numbers: [1, 9],
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0),
    direction: bagua.compassDirection.Center,
  },
  Metal: {
    order: 4,
    trigrams: [bagua.bagua.xùn, bagua.bagua.lí],     
    numbers: [4, 9],
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255),
    direction: bagua.compassDirection.West,
  },
  Water: {
    order: 5,
    trigrams: [bagua.bagua.kǎn, bagua.bagua.qián],     
    numbers: [1, 6],
    bodyPart: 'kidneys',
    color: Color.rgb(	0, 0, 0),
    direction: bagua.compassDirection.North,
  }    
};

/** Elements in Relation to Celestial Stems Fu Hsi's Later Heaven Sequence
 *  Progressive sequence of the elements from left to right, and then from Last to First (Water Produces Wood)
 *  Used in This Interpretation Of IChing Astrology 
 * (W.K. Chu, 1993, p.13)
 *  **/
const laterHeavenElementSequence = [laterHeavenElements.Wood, laterHeavenElements.Fire, laterHeavenElements.Earth, laterHeavenElements.Metal, laterHeavenElements.Water];

/** Elements in Relation to Celestial Stems Fu Hsi's Earlier Heaven Sequence
 * Order shows the manner of one element generating another in the cycle of the seasons
 * The order of the elements is Metal, Earth, Wood, Wind, Water, Fire, Mountain, Lake and then back to Metal
 * Represents Heavenly Arrangents of the Elements Prior to Manefestation on Earth
*/

const ealierHeavenElements = {
  Wood: {
    order: 1,       
    trigrams: [bagua.bagua.qián, bagua.bagua.kūn],
    numbers: [6, 2],
    bodyPart: 'liver',
    color: Color.rgb(	0, 255, 0), // Green
    },
  Fire: {
    order: 2,       
    trigrams: [bagua.bagua.gèn, bagua.bagua.duì],  
    numbers: [8, 7],
    bodyPart: 'heart',
    color: Color.rgb(	255, 0, 0), // Red
  },
  Earth: {
    order: 3,
    trigrams: [bagua.bagua.kǎn, bagua.bagua.lí],    // (1 + 9 = 10 = 5 + 5 )
    numbers: [1, 9],
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0),    // Yellow
  },
  Metal: {
    order: 4,
    trigrams: [bagua.bagua.zhèn, bagua.bagua.xùn],     
    numbers: [4, 9],
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255), // White    

  },
  Water: {
    order: 5,
    trigrams: [bagua.bagua.qián, bagua.bagua.kūn],     
    numbers: [6, 2],
    bodyPart: 'kidneys',
    color: Color.rgb(	0, 0, 0), // Black 
  }    
};


/** The matching of the Trigrams (bagua) and their respective positive (Yang) and negative (Yin) natures
 * with the 5 elements to produce the 10 Celestial Stems
 * Winter Solstice is the Starting point for the Celestial Stems
 */


class CelestialStem {
  constructor(name, trigram, oppositeTrigram, element, alphabeticOrder) {
    this.name = name;
    this.element = element;  
    this.trigram = trigram;
    this.oppositeTrigram = oppositeTrigram;
    this.alphabeticOrder = alphabeticOrder;
  }

  getName() {
    return this.name;
  }

  getElement() {
    return this.element;
  }

  getTrigram() {
    return this.trigram;
  }

  getOppositeTrigram() {
    return this.oppositeTrigram;
  }

  getAlphabeticOrder() {
    return this.alphabeticOrder;
  }

}

class HoraryBranch {
  constructor(name, hoMapNumbers,element, alphabeticOrder) {
    this.name = name;
    this.element = element;    
    this.hoMapNumbers = hoMapNumbers;
    this.alphabeticOrder = alphabeticOrder;
  }

  getName() {
    return this.name;
  }

  getElement() {
    return this.element;
  }
  getHoMapNumbers() {
    return this.hoMapNumbers;
  }

  getAlphabeticOrder() {
    return this.alphabeticOrder;
  }
}

class SexagenaryCycle {
  constructor (number, celestialStem, horaryBranch, polarity) {
    this.number = number;
    this.celestialStem = celestialStem;
    this.horaryBranch = horaryBranch;
    this.polarity = polarity;
  }

  getNumber () {
      return this.number;
    }
  
  getCelestialStem() {
    return this.celestialStem;
  }

  getHoraryBranch() {
    return this.horaryBranch;
  }
  getPolarity() {
    return this.polarity;
  }
}

class SexagenarySubCycle
{
  constructor(upperCycle, middleCycle, lowerCycle) 
  {  
    this.upperCycle = upperCycle;
    this.middleCycle = middleCycle;  
    this.lowerCycle = lowerCycle;  
  }

}

class IChingAstrology {
  constructor() {
    this.sexagenarySubCycle = new SexagenarySubCycle( Number(1864), Number(1924), Number(1984));

    this.elements = ealierHeavenElements;

    /** The trigram, (bagua) shows which part of the Stem(when paired with another Stem) 
     * contributes to the element, yoa indicates if it is positive or negative contribution */
    this.celestialStems = [
      new CelestialStem('Chia', bagua.bagua.qián, bagua.bagua.kūn, ealierHeavenElements.Wood, 'A'),
      new CelestialStem('I',    bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Wood, 'B'),
      new CelestialStem('Ping', bagua.bagua.gèn,  bagua.bagua.duì,  ealierHeavenElements.Fire, 'C'),
      new CelestialStem('Ting', bagua.bagua.duì,  bagua.bagua.gèn,  ealierHeavenElements.Fire, 'D'), 
      new CelestialStem('Wu',   bagua.bagua.kǎn,  bagua.bagua.li,   ealierHeavenElements.Earth, 'E'),
      new CelestialStem('Chi',  bagua.bagua.li,   bagua.bagua.kǎn,  ealierHeavenElements.Earth, 'F'),
      new CelestialStem('Keng', bagua.bagua.zhèn, bagua.bagua.xùn,  ealierHeavenElements.Metal, 'G'),
      new CelestialStem('Hsin', bagua.bagua.xùn,  bagua.bagua.zhèn, ealierHeavenElements.Metal, 'H'),
      new CelestialStem('Jen',  bagua.bagua.qián,  bagua.bagua.kūn, ealierHeavenElements.Water, 'I'),
      new CelestialStem('Kuei', bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Water, 'J'), 
    ];
    /** The numbers in the horary branch are from the Ho Map */
    this.horaryBranches = [
      new HoraryBranch('Tzu',    [1, 6] , ealierHeavenElements.Water, 'a' ),
      new HoraryBranch(`Ch'ou`,  [5, 10], ealierHeavenElements.Earth, 'b' ),
      new HoraryBranch('Yin',   [5, 8], ealierHeavenElements.Wood, 'c' ),
      new HoraryBranch('Mao',   [5, 8], ealierHeavenElements.Wood, 'd' ),
      new HoraryBranch(`Ch'en`, [5, 10] , ealierHeavenElements.Earth, 'e' ),
      new HoraryBranch('Szu',   [2, 7], ealierHeavenElements.Fire, 'f' ),
      new HoraryBranch('Wu',    [2, 7], ealierHeavenElements.Fire, 'g' ),
      new HoraryBranch('Wei',   [5, 10], ealierHeavenElements.Earth, 'h' ),
      new HoraryBranch('Shen',  [4, 9], ealierHeavenElements.Metal, 'i' ),
      new HoraryBranch('Yu',    [4, 9], ealierHeavenElements.Metal, 'j' ),
      new HoraryBranch('Hsu',   [5, 10], ealierHeavenElements.Earth, 'k' ),
      new HoraryBranch('Hai',   [1, 6], ealierHeavenElements.Water, 'l' ),      
    ];
    /** Compute Sexagenary Cycles based on combinations of Celestial stems and Horary Branches */
    this.sexagenaryCycle = [];
    let count = 0;
    let cycle = 0;
    /** Only calculate the first 60 */
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < this.celestialStems.length; i++) {          
            count++;            
            this.sexagenaryCycle.push(new SexagenaryCycle(count, this.celestialStems[i], this.horaryBranches[cycle], count % 2 === 0 ? yao.yao.yin : yao.yao.yang));
             // console.log(count,this.celestialStems[i].alphabeticOrder, this.horaryBranches[cycle].alphabeticOrder,  count % 2 === 0 ? yao.yao.yin.polarityString : yao.yao.yang.polarityString);
            cycle++;
            if (cycle == 12)
            {
              cycle = 0;
            }
          }
    }
  }
  /** Get the Upper, Middle and Lower Reference Cycles as Defined By (Sherrill and Chu, 1976)  
   *  These cycles represent a starting point for calculating the sexagenary cycle
   *  for any given year in the past or future 
   * 
  */
    getUpperCycle() {
      let cycle =[];
      for (let i = this.sexagenarySubCycle.upperCycle; i < this.sexagenarySubCycle.upperCycle + 60; i++) {        
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-this.sexagenarySubCycle.upperCycle]});
        }
      return cycle;
    }

    getMiddleCycle() {
      let cycle =[];
      for (let i = this.sexagenarySubCycle.middleCycle; i < this.sexagenarySubCycle.middleCycle + 60; i++) {        
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-this.sexagenarySubCycle.middleCycle]});
        }
      return cycle;
    }

    getLowerCycle() {
      let cycle =[];
      for (let i = this.sexagenarySubCycle.lowerCycle; i < this.sexagenarySubCycle.lowerCycle + 60; i++) {
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-this.sexagenarySubCycle.lowerCycle]});
        }
      return cycle;
    }

    /** Get Full Sexagenary Cycle A particular Year Falls In 
     * Given a year, return the sexagenary cycle for that year based on the upper, middle and lower cycles each being 60 years
     * and the starting point for each cycle being 1864, 1924 and 1984 respectively
     * compute the correct cycle even if the year is before 1864 or after 1984, 
     * given the cycles follow a 60 year pattern and run from Upper → Middle → Lower → Upper → Middle → Lower and so on.
     */    

    getFullSexagenaryCycle(year) {
      const cycles = {
          upper: { start: 1864, end: 1923 },
          middle: { start: 1924, end: 1983 },
          lower: { start: 1984, end: 2043 }
      };
  
      const cycleNames = ['upper', 'middle', 'lower'];
      const cycleLength = cycles.lower.end - cycles.lower.start + 1;
  
      // Calculate total offset from the first defined upper cycle
      let totalYearsOffset = year - cycles.upper.start;
  
      // Calculate how many complete 3-cycle periods (180 years) fit into the offset
      let fullCyclePeriods = Math.floor(totalYearsOffset / (3 * cycleLength));
      
      // Calculate the remainder years after removing the full cycles
      let remainderYears = totalYearsOffset % (3 * cycleLength);
      
      // Adjust for negative remainders (i.e., years before 1864)
      if (remainderYears < 0) {
          remainderYears += 3 * cycleLength;
      }
  
      // Determine the cycle index based on the remainder
      let cycleIndex = Math.floor(remainderYears / cycleLength);
  
      // Find the corresponding cycle name
      let cycleName = cycleNames[cycleIndex];
  
      // Calculate the start and end years of the cycle
      let cycleStart = cycles.upper.start + fullCyclePeriods * (3 * cycleLength) + cycleIndex * cycleLength;
      let cycleEnd = cycleStart + cycleLength - 1;

      let cycle =[];
      for (let i = cycleStart; i < cycleStart + 60; i++) {
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-cycleStart]});
        }
  
      return {
          cycleName: cycleName,
          startYear: cycleStart,
          endYear: cycleEnd,
          year: year,
          cycle: cycle,
      };
  }

  getYearSexagenaryCycle(year) {
    let fullCycle = this.getFullSexagenaryCycle(year);
    return fullCycle.cycle.find(cycle => cycle.year === year); 
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

    getAllSexagenaryCycles() {
      return this.sexagenaryCycle;
    };

    getCelestialStemByAlpha (alphabeticOrder)
      {
        return this.celestialStems.find(stem => stem.alphabeticOrder === alphabeticOrder);
      }
    
    getHoraryBranchByAlpha (alphabeticOrder)
      {
        return this.horaryBranches.find(branch => branch.alphabeticOrder === alphabeticOrder);
      }

    getSexagenaryCycleByNumber (number)
      {
        return this.sexagenaryCycle.find(cycle => cycle.number === number);
      }
}

class IChingAstrologyManual {
  constructor() {
    this.elements = ealierHeavenElements;

    /** The trigram, (bagua) shows which part of the Stem(when paired with another Stem) 
     * contributes to the element, yoa indicates if it is positive or negative contribution */
    this.celestialStems = [
      new CelestialStem('Chia', bagua.bagua.qián, bagua.bagua.kūn, ealierHeavenElements.Wood, 'A'),
      new CelestialStem('I',    bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Wood, 'B'),
      new CelestialStem('Ping', bagua.bagua.gèn,  bagua.bagua.duì,  ealierHeavenElements.Fire, 'C'),
      new CelestialStem('Ting', bagua.bagua.duì,  bagua.bagua.gèn,  ealierHeavenElements.Fire, 'D'), 
      new CelestialStem('Wu',   bagua.bagua.kǎn,  bagua.bagua.li,   ealierHeavenElements.Earth, 'E'),
      new CelestialStem('Chi',  bagua.bagua.li,   bagua.bagua.kǎn,  ealierHeavenElements.Earth, 'F'),
      new CelestialStem('Keng', bagua.bagua.zhèn, bagua.bagua.xùn,  ealierHeavenElements.Metal, 'G'),
      new CelestialStem('Hsin', bagua.bagua.xùn,  bagua.bagua.zhèn, ealierHeavenElements.Metal, 'H'),
      new CelestialStem('Jen',  bagua.bagua.qián,  bagua.bagua.kūn, ealierHeavenElements.Water, 'I'),
      new CelestialStem('Kuei', bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Water, 'J'), 
    ];
    /** The numbers in the horary branch are from the Ho Map */
    this.horaryBranches = [
      new HoraryBranch('Tzu',    [1, 6] , ealierHeavenElements.Water, 'a' ),
      new HoraryBranch(`Ch'ou`,  [5, 10], ealierHeavenElements.Earth, 'b' ),
      new HoraryBranch('Yin',   [5, 8], ealierHeavenElements.Wood, 'c' ),
      new HoraryBranch('Mao',   [5, 8], ealierHeavenElements.Wood, 'd' ),
      new HoraryBranch(`Ch'en`, [5, 10] , ealierHeavenElements.Earth, 'e' ),
      new HoraryBranch('Szu',   [2, 7], ealierHeavenElements.Fire, 'f' ),
      new HoraryBranch('Wu',    [2, 7], ealierHeavenElements.Fire, 'g' ),
      new HoraryBranch('Wei',   [5, 10], ealierHeavenElements.Earth, 'h' ),
      new HoraryBranch('Shen',  [4, 9], ealierHeavenElements.Metal, 'i' ),
      new HoraryBranch('Yu',    [4, 9], ealierHeavenElements.Metal, 'j' ),
      new HoraryBranch('Hsu',   [5, 10], ealierHeavenElements.Earth, 'k' ),
      new HoraryBranch('Hai',   [1, 6], ealierHeavenElements.Water, 'l' ),      
    ];
    /** Sexagenary Cycles based on combinations of Celestial stems and Horary Branches */
    this.sexagenaryCycle = [
      new SexagenaryCycle(1, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('a'), yao.yao.yang),
      new SexagenaryCycle(2, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('b'), yao.yao.yin),
      new SexagenaryCycle(3, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('c'), yao.yao.yang),
      new SexagenaryCycle(4, this.getCelestialStemByAlpha('D'), this.getHoraryBranchByAlpha('d'), yao.yao.yin),
      new SexagenaryCycle(5, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('e'), yao.yao.yang),
      new SexagenaryCycle(6, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('f'), yao.yao.yin),
      new SexagenaryCycle(7, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('g'), yao.yao.yang),
      new SexagenaryCycle(8, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('h'), yao.yao.yin),
      new SexagenaryCycle(9, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('i'), yao.yao.yang),
      new SexagenaryCycle(10, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('j'), yao.yao.yin),

      new SexagenaryCycle(11, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('k'), yao.yao.yang),
      new SexagenaryCycle(12, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('l'), yao.yao.yin),
      new SexagenaryCycle(13, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('a'), yao.yao.yang),
      new SexagenaryCycle(14, this.getCelestialStemByAlpha('D'), this.getHoraryBranchByAlpha('b'), yao.yao.yin),
      new SexagenaryCycle(15, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('c'), yao.yao.yang),
      new SexagenaryCycle(16, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('d'), yao.yao.yin),
      new SexagenaryCycle(17, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('e'), yao.yao.yang),
      new SexagenaryCycle(18, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('f'), yao.yao.yin),
      new SexagenaryCycle(19, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('g'), yao.yao.yang),
      new SexagenaryCycle(20, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('h'), yao.yao.yin),

      new SexagenaryCycle(21, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('i'), yao.yao.yang),
      new SexagenaryCycle(22, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('j'), yao.yao.yin),
      new SexagenaryCycle(23, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('k'), yao.yao.yang),
      new SexagenaryCycle(24, this.getCelestialStemByAlpha('D'), this.getCelestialStemByAlpha('l'), yao.yao.yin),
      new SexagenaryCycle(25, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('a'), yao.yao.yang),
      new SexagenaryCycle(26, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('b'), yao.yao.yin),
      new SexagenaryCycle(27, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('c'), yao.yao.yang),
      new SexagenaryCycle(28, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('d'), yao.yao.yin),
      new SexagenaryCycle(29, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('e'), yao.yao.yang),
      new SexagenaryCycle(30, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('f'), yao.yao.yin),
     
      new SexagenaryCycle(31, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('g'), yao.yao.yang),
      new SexagenaryCycle(32, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('h'), yao.yao.yin),
      new SexagenaryCycle(33, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('i'), yao.yao.yang),
      new SexagenaryCycle(34, this.getCelestialStemByAlpha('D'), this.getHoraryBranchByAlpha('j'), yao.yao.yin),
      new SexagenaryCycle(35, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('k'), yao.yao.yang),
      new SexagenaryCycle(36, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('l'), yao.yao.yin),
      new SexagenaryCycle(37, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('a'), yao.yao.yang),
      new SexagenaryCycle(38, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('b'), yao.yao.yin),
      new SexagenaryCycle(39, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('c'), yao.yao.yang),
      new SexagenaryCycle(40, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('d'), yao.yao.yin),

      new SexagenaryCycle(41, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('e'), yao.yao.yang),
      new SexagenaryCycle(42, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('f'), yao.yao.yin),
      new SexagenaryCycle(43, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('g'), yao.yao.yang),
      new SexagenaryCycle(44, this.getCelestialStemByAlpha('D'), this.getHoraryBranchByAlpha('h'), yao.yao.yin),
      new SexagenaryCycle(45, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('i'), yao.yao.yang),
      new SexagenaryCycle(46, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('j'), yao.yao.yin),
      new SexagenaryCycle(47, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('k'), yao.yao.yang),
      new SexagenaryCycle(48, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('l'), yao.yao.yin),
      new SexagenaryCycle(49, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('a'), yao.yao.yang),
      new SexagenaryCycle(50, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('b'), yao.yao.yin),

      new SexagenaryCycle(51, this.getCelestialStemByAlpha('A'), this.getHoraryBranchByAlpha('c'), yao.yao.yang),
      new SexagenaryCycle(52, this.getCelestialStemByAlpha('B'), this.getHoraryBranchByAlpha('d'), yao.yao.yin),
      new SexagenaryCycle(53, this.getCelestialStemByAlpha('C'), this.getHoraryBranchByAlpha('e'), yao.yao.yang),
      new SexagenaryCycle(54, this.getCelestialStemByAlpha('D'), this.getHoraryBranchByAlpha('f'), yao.yao.yin),
      new SexagenaryCycle(55, this.getCelestialStemByAlpha('E'), this.getHoraryBranchByAlpha('g'), yao.yao.yang),
      new SexagenaryCycle(56, this.getCelestialStemByAlpha('F'), this.getHoraryBranchByAlpha('h'), yao.yao.yin),
      new SexagenaryCycle(57, this.getCelestialStemByAlpha('G'), this.getHoraryBranchByAlpha('i'), yao.yao.yang),
      new SexagenaryCycle(58, this.getCelestialStemByAlpha('H'), this.getHoraryBranchByAlpha('j'), yao.yao.yin),
      new SexagenaryCycle(59, this.getCelestialStemByAlpha('I'), this.getHoraryBranchByAlpha('k'), yao.yao.yang),
      new SexagenaryCycle(60, this.getCelestialStemByAlpha('J'), this.getHoraryBranchByAlpha('l'), yao.yao.yin),
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

  getAllSexagenaryCycles() {
    return this.sexagenaryCycle;
  };

  getCelestialStemByAlpha (alphabeticOrder)
    {
      return this.celestialStems.find(stem => stem.alphabeticOrder === alphabeticOrder);
    }
  
  getHoraryBranchByAlpha (alphabeticOrder)
    {
      return this.horaryBranches.find(branch => branch.alphabeticOrder === alphabeticOrder);
    }

  getSexagenaryCycleByNumber (number)
    {
      return this.sexagenaryCycle.find(cycle => cycle.number === number);
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
  magicSquareOfThree,
  laterHeavenElements,
  ealierHeavenElements,
  SexagenaryCycle,
  CelestialStem,
  HoraryBranch,
  IChingAstrology,
  IChingAstrologyManual,
  hexagramAstrology,
  calculateTrueLocalTime,
  getSolarTerm,
  determineSubCycle,
  computeSexagenaryCycle,
  calculateNatalHexagram
  
}