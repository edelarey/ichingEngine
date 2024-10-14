const { DateTime } = require('luxon');
const SunCalc = require('suncalc');
import { name } from 'vue-slide-bar';
// import { name } from 'vue-slide-bar';
import bagua from '../const/bagua';
import hexagram from './hexagram';
import yao from './yao';
const Color = require("color");

/** Structure to represent gender */
const Gender = {
  MALE: 'male',
  FEMALE: 'female',
};



/** The following is based on The Astrology of I Ching by W.A. Sherrill and W.K. Chu, Routledge and Keegan Paul, 1976 */

/** Ho Lo Li Shu - Ho Map Lo Map Rational Number (W.K. Chu, 1993, p.8) */
const hoMap = {
  Wood: {
    name: 'Wood',
    order: 1,       
    numbers: [3, 8],  
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'liver',
    direction: bagua.compassDirection.East,
    color: Color.rgb(	0, 255, 0), // Green
    },
  Fire: {
    name: 'Fire',
    order: 2,           
    numbers: [2, 7],
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'heart',
    direction: bagua.compassDirection.South,
    color: Color.rgb(	255, 0, 0), // Red
  },
  Earth: {
    name: 'Earth',
    order: 3,   
    numbers: [5, 10],  // 1, 9 = 5 + 5 = 10 
    polarity: [yao.yao.yin, yao.yao.yang],
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0), // Yellow
    direction: bagua.compassDirection.Center,
  },
  Metal: {
    name: 'Metal',
    order: 4,    
    numbers: [4, 9],
    polarity: [yao.yao.yang, yao.yao.yin],
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255), // White
    direction: bagua.compassDirection.West,
  },
  Water: {
    name: 'Water',
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
    name: 'Wood',
    order: 1,       
    trigrams: [bagua.bagua.zhèn, bagua.bagua.gèn],
    numbers: [3, 8],
    bodyPart: 'liver',
    direction: bagua.compassDirection.East,
    color: Color.rgb(	0, 255, 0),
    },
  Fire: {
    name: 'Fire',
    order: 2,       
    trigrams: [bagua.bagua.kūn, bagua.bagua.duì],  
    numbers: [2, 7],
    bodyPart: 'heart',
    direction: bagua.compassDirection.South,
    color: Color.rgb(	255, 0, 0),
  },
  Earth: {
    name: 'Earth',
    order: 3,
    trigrams: [bagua.bagua.kǎn, bagua.bagua.lí],    // (1, 9 = 5 + 5 = 10 )
    numbers: [1, 9],
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0),
    direction: bagua.compassDirection.Center,
  },
  Metal: {
    name: 'Metal',
    order: 4,
    trigrams: [bagua.bagua.xùn, bagua.bagua.lí],     
    numbers: [4, 9],
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255),
    direction: bagua.compassDirection.West,
  },
  Water: {
    name: 'Water',
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
    name: 'Wood',
    order: 1,       
    trigrams: [bagua.bagua.qián, bagua.bagua.kūn],
    numbers: [6, 2],
    polarity: [yao.yao.yang, yao.yao.yin], 
    bodyPart: 'liver',
    color: Color.rgb(	0, 255, 0), // Green
    },
  Fire: {
    name: 'Fire',
    order: 2,       
    trigrams: [bagua.bagua.gèn, bagua.bagua.duì],  
    numbers: [8, 7],
    polarity: [yao.yao.yang, yao.yao.yin], 
    bodyPart: 'heart',
    color: Color.rgb(	255, 0, 0), // Red
  },
  Earth: {
    name: 'Earth',
    order: 3,
    trigrams: [bagua.bagua.kǎn, bagua.bagua.lí],    // (1 + 9 = 10 = 5 + 5 )
    numbers: [1, 9],
    polarity: [yao.yao.yang, yao.yao.yin], 
    bodyPart: 'spleen',
    color: Color.rgb(	255, 255, 0),    // Yellow
  },
  Metal: {
    name: 'Metal',
    order: 4,    
    trigrams: [bagua.bagua.zhèn, bagua.bagua.xùn],     
    numbers: [4, 9],
    polarity: [yao.yao.yang, yao.yao.yin], 
    bodyPart: 'lungs',
    color: Color.rgb(	255, 255, 255), // White    

  },
  Water: {
    name: 'Water',
    order: 5,
    trigrams: [bagua.bagua.qián, bagua.bagua.kūn],     
    numbers: [6, 2],
    polarity: [yao.yao.yang, yao.yao.yin], 
    bodyPart: 'kidneys',
    color: Color.rgb(	0, 0, 0), // Black 
  }    
};


class HeavenlyNumberTrigram {
  constructor(number, trigram) { 
    this.number = number;
    this.trigram = trigram;
  }  
  getTrigram() {
    return this.trigram;
  }
  getNumber() {
    return this.number;
  }
}

class EarthlyNumberTrigram {
  constructor(number, trigram) {
    this.number = number;
    this.trigram = trigram;
  }
  getTrigram() {
    return this.trigram;
  }
  getNumber() {
    return this.number;
  }
}  

/** The matching of the Trigrams (bagua) and their respective positive (Yang) and negative (Yin) natures
 * with the 5 elements to produce the 10 Celestial Stems
 * Winter Solstice is the Starting point for the Celestial Stems
 */
class CelestialStem {
  constructor(name, symbol, hoMapNumber, trigram, oppositeTrigram, element, alphabeticOrder) {
    this.name = name;
    this.symbol = symbol;
    this.hoMapNumber = hoMapNumber;
    this.element = element;  
    this.trigram = trigram;
    this.oppositeTrigram = oppositeTrigram;
    this.alphabeticOrder = alphabeticOrder;
  }

  getName() {
    return this.name;
  }

  getSymbol() {
    return this.symbol;
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

  getHoMapNumber() {
    return this.hoMapNumber;
  }

}

class HoraryBranch {
  constructor(name, symbol, hoMapNumbers,element, alphabeticOrder, animal) {
    this.name = name;
    this.symbol = symbol;
    this.element = element;    
    this.hoMapNumbers = hoMapNumbers;
    this.alphabeticOrder = alphabeticOrder;
    this.animal = animal;
  }

  getName() {
    return this.name;
  }

  getSymbol() {
    return this.symbol;
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

  getAnimal() {
    return this.animal;
  }
}


class MonthlyStemBranch {
  constructor(month, polarity, season, years) {
    this.month = month;
    this.polarity = polarity;
    this.season = season;
    this.years = years;
  }
}

class HourlyStemBranch {
  constructor(startHour, stopHour, applicableStemBranches) {
    this.startHour = startHour;
    this.stopHour = stopHour;
    this.stemBranch = applicableStemBranches;
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

class HourlySymbol{
  constructor(startHour, stopHour, symbol, polarity) {
    this.startHour = startHour;
    this.stopHour = stopHour;
    this.symbol = symbol;
    this.polarity = polarity;    
  }

}

class IChingAstrology_North {
  constructor() {
    this.sexagenarySubCycle = new SexagenarySubCycle( Number(1864), Number(1924), Number(1984));

    this.elements = ealierHeavenElements;

    /** The trigram, (bagua) shows which part of the Stem(when paired with another Stem) 
     * contributes to the element, yoa indicates if it is positive or negative contribution */
    this.celestialStems = [
      new CelestialStem('Chia','甲', 6, bagua.bagua.qián, bagua.bagua.kūn, ealierHeavenElements.Wood, 'A'),
      new CelestialStem('I', '乙',   2, bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Wood, 'B'),
      new CelestialStem('Ping', '丙', 8, bagua.bagua.gèn,  bagua.bagua.duì,  ealierHeavenElements.Fire, 'C'),
      new CelestialStem('Ting', '丁', 7, bagua.bagua.duì,  bagua.bagua.gèn,  ealierHeavenElements.Fire, 'D'), 
      new CelestialStem('Wu',  '戊', 1, bagua.bagua.kǎn,  bagua.bagua.lí,   ealierHeavenElements.Earth, 'E'),
      new CelestialStem('Chi', '己', 9, bagua.bagua.lí,   bagua.bagua.kǎn,  ealierHeavenElements.Earth, 'F'),
      new CelestialStem('Keng', '庚', 3, bagua.bagua.zhèn, bagua.bagua.xùn,  ealierHeavenElements.Metal, 'G'),
      new CelestialStem('Hsin', '辛', 4, bagua.bagua.xùn,  bagua.bagua.zhèn, ealierHeavenElements.Metal, 'H'),
      new CelestialStem('Jen',  '壬', 6, bagua.bagua.qián,  bagua.bagua.kūn, ealierHeavenElements.Water, 'I'),
      new CelestialStem('Kuei', '癸', 2, bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Water, 'J'), 
    ];
    /** The numbers in the horary branch are from the Ho Map */
    this.horaryBranches = [
      new HoraryBranch('Tzu', '子',   [1, 6] , ealierHeavenElements.Water, 'a', 'Rat' ),
      new HoraryBranch(`Ch'ou`, '丑',  [5, 10], ealierHeavenElements.Earth, 'b', 'Ox' ),
      new HoraryBranch('Yin','寅',   [3,8], ealierHeavenElements.Wood, 'c', 'Tiger'),
      new HoraryBranch('Mao', '卯',   [3,8], ealierHeavenElements.Wood, 'd', 'Rabbit' ),
      new HoraryBranch(`Ch'en`, '辰', [5, 10] , ealierHeavenElements.Earth, 'e', 'Dragon' ),
      new HoraryBranch('Szu', '巳', [2,7], ealierHeavenElements.Fire, 'f', 'Snake' ),
      new HoraryBranch('Wu', '午',   [2,7], ealierHeavenElements.Fire, 'g', 'Horse' ),
      new HoraryBranch('Wei', '未',   [5, 10], ealierHeavenElements.Earth, 'h', 'Goat' ),
      new HoraryBranch('Shen', '申',  [4,9], ealierHeavenElements.Metal, 'i', 'Monkey' ),
      new HoraryBranch('Yu', '酉',   [4,9], ealierHeavenElements.Metal, 'j', 'Rooster' ),
      new HoraryBranch('Hsu', '戌',  [5, 10], ealierHeavenElements.Earth, 'k', 'Dog' ),
      new HoraryBranch('Hai', '亥',  [1, 6], ealierHeavenElements.Water, 'l', 'Pig' ),      
    ];
    /** Static Stems and Branches Stem is Upper Case, Branch is lower case, ApplicABLE Year - Stem and Branch */
    
   

    this.monthlyStemsAndBranches = [
      new MonthlyStemBranch('December_last_half', '+', ['Winter Solstice'],  {AF: "Aa", BG: "Ca", CH: "Ea", DI: "Ga", EJ: "Ia"}),
      new MonthlyStemBranch('January', '-', ['Little Cold', 'Severe Cold'],  {AF: "Bb", BG: "Db", CH: "Fb", DI: "Hb", EJ: "Jb"}),
      new MonthlyStemBranch('February', '+', ['Spring Begins', 'Rain Water'], {AF: "Cc", BG: "Ec", CH: "Gc", DI: "Ic", EJ: "Ac"} ),      
      new MonthlyStemBranch('March', '-', ['Excited Insects', 'Vernal Equinox'], {AF: "Dd", BG: "Fb", CH: "Hd", DI: "Jd", EJ: "Bd"}),
      new MonthlyStemBranch('April', '+', ['Clear Bright', 'Grain Rains'], {AF: "Ee", BG: "Ge", CH: "Ie", DI: "Ae", EJ: "Ce"}),
      new MonthlyStemBranch('May', '-', ['Summer Begins', 'Grain Fills'], {AF: "Ff", BG: "Hf", CH: "Jf", DI: "Bf", EJ: "Df"}),
      new MonthlyStemBranch('June', '+', ['Grain in Ear', 'Summer Solstice'], {AF: "Gg", BG: "Ig", CH: "Ag", DI: "Cg", EJ: "Eg"}),
      new MonthlyStemBranch('July', '-', ['Slight Heat', 'Great Heat'],  {AF: "Hh", BG: "Jh", CH: "Bh", DI: "Dh",EJ: "Fh"}),
      new MonthlyStemBranch('August', '+', ['Autumn Begins', 'Limit of Heat'], {AF: "Ii", BG: "Ai", CH: "Ci", DI: "Ei",EJ: "Gi"}),
      new MonthlyStemBranch('September', '-', ['White Dew', 'Autumnal Equinox'], {AF: "Jj", BG: "Bj", CH: "Dj", DI: "Fj", EJ: "Hj"}),
      new MonthlyStemBranch('October', '+', ['Cold Dew', 'Hoar Frost Descends'], {AF: "Ak", BG: "Ck", CH: "Ek", DI: "Gk",EJ: "Ik"}),
      new MonthlyStemBranch('November', '-', ['Winter Begins', 'Little Snow'], {AF: "Bl",BG: "Dl", CH: "Fl",  DI: "Hl", EJ: "Jl"}),
      new MonthlyStemBranch('December_first_half', '+',  {AF: "Ca", BG: "Ea", CH: "Ga", DI: "Ia", EJ: "Aa"})
    ];

   

    this.hourlyStemsBranches =
    [ new HourlyStemBranch(0, 1, {AF: "Aa", BG: "Ca", CH: "Ea", DI: "Ga", EJ: "Ia"}),
      new HourlyStemBranch(1, 3,  {AF: "Bb", BG: "Db", CH: "Fb", DI: "Hb", EJ: "Jb"}),
      new HourlyStemBranch(3, 5, {AF: "Cc", BG: "Ec", CH: "Gc", DI: "Ic", EJ: "Ac"} ),      
      new HourlyStemBranch(5, 7, {AF: "Dd", BG: "Fb", CH: "Hd", DI: "Jd", EJ: "Bd"}),
      new HourlyStemBranch(7, 9, {AF: "Ee", BG: "Ge", CH: "Ie", DI: "Ae", EJ: "Ce"}),
      new HourlyStemBranch(9, 11, {AF: "Ff", BG: "Hf", CH: "Jf", DI: "Bf", EJ: "Df"}),
      new HourlyStemBranch(11, 13, {AF: "Gg", BG: "Ig", CH: "Ag", DI: "Cg", EJ: "Eg"}),
      new HourlyStemBranch(13, 15, {AF: "Hh", BG: "Jh", CH: "Bh", DI: "Dh",EJ: "Fh"}),
      new HourlyStemBranch(15, 17, {AF: "Ii", BG: "Ai", CH: "Ci", DI: "Ei",EJ: "Gi"}),
      new HourlyStemBranch(17, 19, {AF: "Jj", BG: "Bj", CH: "Dj", DI: "Fj", EJ: "Hj"}),
      new HourlyStemBranch(19, 21, {AF: "Ak", BG: "Ck", CH: "Ek", DI: "Gk",EJ: "Ik"}),
      new HourlyStemBranch(21, 23, {AF: "Bl",BG: "Dl", CH: "Fl",  DI: "Hl", EJ: "Jl"}),
      new HourlyStemBranch(23, 0, {AF: "Ca", BG: "Ea", CH: "Ga", DI: "Ia", EJ: "Aa"})
    ];

    this.hourlySymbols = [
      new HourlySymbol(23, 1,  `a`, yao.yao.yang),
      new HourlySymbol(1, 3,  `b`, yao.yao.yang),
      new HourlySymbol(3, 5,  `c`, yao.yao.yang),
      new HourlySymbol(5, 7,  `d`, yao.yao.yang),
      new HourlySymbol(7, 9,  `e`, yao.yao.yang),
      new HourlySymbol(9, 11, `f`, yao.yao.yang),
      new HourlySymbol(11, 13, `g`, yao.yao.yin),
      new HourlySymbol(13, 15, `h`, yao.yao.yin),
      new HourlySymbol(15, 17, `i`, yao.yao.yin),
      new HourlySymbol(17, 19, `j`, yao.yao.yin),
      new HourlySymbol(19, 21, `k`, yao.yao.yin),
      new HourlySymbol(21, 23, `l`, yao.yao.yin),
    ];

    

    /** Heavenly Numbers for the Various Cycles and Genders */
    this.heavenlyNumbersUpperCycleMale = [
      new HeavenlyNumberTrigram(1, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(2, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(3, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(4, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(5, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(6, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(7, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(8, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(9, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(10, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(11, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(12, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(13, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(14, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(15, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(16, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(17, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(18, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(19, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(20, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(21, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(22, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(23, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(24, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(25, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(26, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(27, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(28, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(29, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(30, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(31, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(32, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(33, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(34, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(35, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(36, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(37, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(38, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(39, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(40, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(41, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(42, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(43, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(44, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(45, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(46, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(47, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(48, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(49, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(50, bagua.bagua.gèn ),
    ];

    this.heavenlyNumbersUpperCycleFemale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersUpperCycleFemale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.kūn);

    this.heavenlyNumbersMiddleCycleMaleEvenFemaleOdd = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersMiddleCycleMaleOddFemaleEven = this.heavenlyNumbersUpperCycleFemale;

    this.heavenlyNumbersLowerCycleMale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersLowerCycleMale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.lí);

    this.heavenlyNumbersLowerCycleFemale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersLowerCycleFemale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.duì);

  /** Heavenly Numbers for the Earthly Cycle */
  this.earthlyNumbers = [
    new EarthlyNumberTrigram(2, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(4, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(6, bagua.bagua.qián ),
    new EarthlyNumberTrigram(8, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(10, bagua.bagua.kǎn ),
    new EarthlyNumberTrigram(12, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(14, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(16, bagua.bagua.qián ),
    new EarthlyNumberTrigram(18, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(20, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(22, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(24, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(26, bagua.bagua.qián ),
    new EarthlyNumberTrigram(28, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(30, bagua.bagua.zhèn ),
    new EarthlyNumberTrigram(32, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(34, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(36, bagua.bagua.qián ),
    new EarthlyNumberTrigram(38, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(40, bagua.bagua.kǎn ),
    new EarthlyNumberTrigram(42, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(44, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(46, bagua.bagua.qián ),
    new EarthlyNumberTrigram(48, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(50, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(52, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(54, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(56, bagua.bagua.qián ),
    new EarthlyNumberTrigram(58, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(60, bagua.bagua.zhèn ),    
  ];

    




    /** Compute Sexagenary Cycles based on combinations of Celestial stems and Horary Branches */
    this.sexagenaryCycle = [];
    this.initializeSexagenaryCycles();
  }

  initializeSexagenaryCycles() {
    let count = 0;
    let cycle = 0;
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < this.celestialStems.length; i++) {          
        count++;            
        this.sexagenaryCycle.push(new SexagenaryCycle(count, this.celestialStems[i], this.horaryBranches[cycle], count % 2 === 0 ? yao.yao.yin : yao.yao.yang));
        cycle++;
        if (cycle == 12) {
          cycle = 0;
        }
      }
    }
  }

  isLeapYear (year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

    // Method to determine the winter solstice of a given year
   getWinterSolstice(year) {
      return DateTime.fromObject({ year: year, month: 12, day: 21 });
    }

      // Helper method to calculate the date from the day of the year
  calculateDateFromDayOfYear(year, dayOfYear) {
    const startDate = new Date(year, 0, 1); // January 1st of the year
    const targetDate = new Date(startDate.setDate(dayOfYear));
    return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  

   // Method to get the stem-branch combination for a specific day
   getDailyCycleForDay(dayIndex) {
    const stemIndex = (dayIndex - 1) % 10;
    const branchIndex = (dayIndex - 1) % 12;
    return {
      celestialStem: this.celestialStems[stemIndex],
      horaryBranch: this.horaryBranches[branchIndex],
    };
  }

   // Method to generate daily cycles for a given year based on the starting day
   generateYearlyDailyCycles(year, startingDay) {
    const daysInYear = 365; // or 366 for leap years
    let dailyCycles = [];
    for (let day = 1; day <= daysInYear; day++) {
      let dayIndex = (startingDay + day - 2) % 60 + 1; // Adjust for starting day and wrap around 60-day cycle
      dailyCycles.push({
        day: day,
        date: this.calculateDateFromDayOfYear(year, day),
        ...this.getDailyCycleForDay(dayIndex)
      });
    }
    return dailyCycles;
  }

   // Helper method to calculate the offset for daily cycles for a given year
   getDailyCycleStart(year) {
    // Adjust based on specific historical data or reference
    const baseYear = 1924;
    const increment = 5; // Increment per year, adjust if needed
    return ((year - baseYear) * increment % 60 + 60) % 60 + 1;
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

     // Method to determine the winter solstice of a given year
    getWinterSolstice(year) {
      return DateTime.fromObject({ year: year, month: 12, day: 21 });
    }

    getMonthlyStemsAndBranchesForaYear(year) {
      let results = [];
  
      for (let month = 1; month <= 12; month++) {
        // Create the DateTime object for the 1st of the month
        let monthStart = DateTime.fromObject({ year: year, month: month, day: 1 });
  
        // Determine the celestial stem and horary branch
        let cycleIndex = ((year - 1864) % 60) * 12 + (month - 1); // Offset within the sexagenary cycle
        let stemIndex = cycleIndex % 10;
        let branchIndex = cycleIndex % 12;
  
        let stem = this.celestialStems[stemIndex];
        let branch = this.horaryBranches[branchIndex];
  
        results.push({
          month: monthStart.toFormat('dd-MM-yyyy'),
          celestialStem: stem,
          horaryBranch: branch
        });
      }
  
      return results;
    }

    getMonthlyStemBranchForaYear (yearSymbol, month, day) {
      // Determine whether it's the first half or last half of December
      let targetMonth;
      if (month === 12) {
        if (day <= 15) {
          targetMonth = 'December_first_half';
        } else {
          targetMonth = 'December_last_half';
        }
      } else {
        // Convert month number to month name
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November'
        ];
        targetMonth = monthNames[month - 1];
      }
    
      // Find the matching monthly stem and branch object
      const monthlyStemBranch = this.monthlyStemsAndBranches.find(
        item => item.month === targetMonth
      );
    
      if (!monthlyStemBranch) {
        throw new Error('Invalid month or structure not found.');
      }
      console.log('monthlySteamAndBranch', monthlyStemBranch);
      // Find the correct applicableYear key that contains the yearSymbol
      const applicableYearKey = Object.keys(monthlyStemBranch.years).find(key => key.includes(yearSymbol));
    
      if (!applicableYearKey) {
        throw new Error('Year symbol does not match any applicable year type.');
      }
    
      // Get the stem and branch using the correct applicable year key
      const stemBranch = monthlyStemBranch.years[applicableYearKey];
    
      return {
        month: month,        
        monthName: targetMonth,
        symbols:stemBranch,
        celestialStem: this.getCelestialStemByAlpha(stemBranch.charAt(0)), // First character is the celestial stem
        horaryBranch:  this.getHoraryBranchByAlpha(stemBranch.charAt(1)),   // Second character is the horary branch
      };
    }

    getHourlyStemABranchForTimeAndSymbol(hour, minute, dailyStemSymbol) {
      // Convert time to hour integer
      
      
     
      
      // Find the matching hourly stem branch object
      const hourlyStemBranch = this.hourlyStemsBranches.find(item => {
        // Handle the 24-hour format and wrap-around (like 24-1 means 00:00 to 01:00)
        if (item.startHour < item.stopHour) {
          // Normal case (e.g., 1-3, 3-5)
          return hour >= item.startHour && hour < item.stopHour;
        } else {
          // Wrap-around case (e.g., 23-1, which means 23:00 to 01:00)
          return (hour >= item.startHour || hour < item.stopHour);
        }
      });
    
      if (!hourlyStemBranch) {
        throw new Error('Invalid time or no matching hourly stem branch found.');
      }
    
      // Find the correct applicable year key that contains the daily stem symbol
      const applicableYearKey = Object.keys(hourlyStemBranch.stemBranch).find(key => key.includes(dailyStemSymbol));
    
      if (!applicableYearKey) {
        throw new Error('Daily stem symbol does not match any applicable year type.');
      }
    
      // Get the stem and branch using the correct applicable year key
      const stemBranchSymbol = hourlyStemBranch.stemBranch[applicableYearKey]

      return {
        time: `${hour}:${minute}`,
        symbols:applicableYearKey,
        celestialStem: this.getCelestialStemByAlpha(stemBranchSymbol.charAt(0)), // First character is the celestial stem
        horaryBranch:  this.getHoraryBranchByAlpha(stemBranchSymbol.charAt(1)),   // Second character is the horary branch
      };
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
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-cycleStart], dailyCycles: this.generateYearlyDailyCycles(i, this.getDailyCycleStart(i))});
        }
  
      return {
          cycleName: cycleName,
          startYear: cycleStart,
          endYear: cycleEnd,
          year: year,
          cycle: cycle,
      };

 }

 getYearSexagenaryObject(fullCycle, year) {
  let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
  return theCycle; 
}

  getYearSexagenaryCycle(year) {
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
    return theCycle.cycle; 
  }

  getYearSexagenaryDailyCycles(year) {
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
    return theCycle.dailyCycles; 
  }
  /** Get a specific daily cycle for a year on date*/
  getYearSexagenaryDailyCycle(year, date) {
    // convert the date to format yyyy-mm-dd 
    let dateStr = date.split('T')[0];
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);  
    let theDay = theCycle.dailyCycles.find(dailyCycle => dailyCycle.date === dateStr);
  
    return theDay; 
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

     getMonthlyStemBranch(year, month) {
          const yearGroupIndex = (year - 1) % 10; // Calculate year group index
          const monthIndex = month === 12 && new Date().getDate() > 15 ? 'December_last_half' : 'December_first_half'; // Special handling for December
      
          // Find the month entry
          const monthEntry = this.monthlyStemsAndBranches.find(entry => entry.month === monthIndex);
          
          if (!monthEntry) {
            throw new Error('Invalid month provided');
          }
      
          // Return the relevant stem and branch for the year group
          return monthEntry.years[yearGroupIndex];
      }
  
     calculateDailyCycleValue(year, month, day) {
        /** Daily Cycle Values (Table 6) */
        const dailyCycleValues = {
          1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // January
          2: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58], // February
          3: [59, 60, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], // March
          4: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], // April
          5: [60, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // May
          6: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], // June
          7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // July
          8: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2], // August
          9: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], // September
          10: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2, 3], // October
          11: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], // November
          12: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2, 3, 4] // December
        };
    
        // Adjust for leap year (from March onward)
        if (this.isLeapYear(year) && month >= 3) {
            day += 1; // Shift day by one for leap years starting in March
        }
       
        const dailyCycleValue = dailyCycleValues[month][day-1]; // Get the value based on month and day

    
        return dailyCycleValue;
        // Determine celestial stem and branch based on cycle value
        
    }

    getJulianDayNumber(date) {
      const dt = DateTime.fromISO(date, { zone: 'UTC' });
      const year = dt.year;
      const month = dt.month;
      const day = dt.day;
    
      let A = Math.floor((14 - month) / 12);
      let Y = year + 4800 - A;
      let M = month + 12 * A - 3;
    
      return day + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
    }

  /**  Function to calculate the sexagenary day number 
   * https://ytliu0.github.io/ChineseCalendar/sexagenary.html
  */
   getSexagenaryDay(date) {

     let jdNoon = this.getJulianDayNumber(date);
      const sexagenaryDay = 1 + ((jdNoon - 11) % 60);
      return sexagenaryDay <= 0 ? sexagenaryDay + 60 : sexagenaryDay;
  }

// Function to calculate the weekday number
   getWeekdayNumber(date) {
      let jdNoon = this.getJulianDayNumber(date);
    return (jdNoon + 1) % 7;
}





}

class IChingAstrology_South {
  constructor() {
    this.sexagenarySubCycle = new SexagenarySubCycle(Number(1869), Number(1929), Number(1989));

    this.elements = ealierHeavenElements;

    /** The trigram, (bagua) shows which part of the Stem(when paired with another Stem) 
     * contributes to the element, yoa indicates if it is positive or negative contribution */
    this.celestialStems = [
      new CelestialStem('Chia','甲', 6, bagua.bagua.qián, bagua.bagua.kūn, ealierHeavenElements.Wood, 'A'),
      new CelestialStem('I', '乙',   2, bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Wood, 'B'),
      new CelestialStem('Ping', '丙', 8, bagua.bagua.gèn,  bagua.bagua.duì,  ealierHeavenElements.Fire, 'C'),
      new CelestialStem('Ting', '丁', 7, bagua.bagua.duì,  bagua.bagua.gèn,  ealierHeavenElements.Fire, 'D'), 
      new CelestialStem('Wu',  '戊', 1, bagua.bagua.kǎn,  bagua.bagua.lí,   ealierHeavenElements.Earth, 'E'),
      new CelestialStem('Chi', '己', 9, bagua.bagua.lí,   bagua.bagua.kǎn,  ealierHeavenElements.Earth, 'F'),
      new CelestialStem('Keng', '庚', 3, bagua.bagua.zhèn, bagua.bagua.xùn,  ealierHeavenElements.Metal, 'G'),
      new CelestialStem('Hsin', '辛', 4, bagua.bagua.xùn,  bagua.bagua.zhèn, ealierHeavenElements.Metal, 'H'),
      new CelestialStem('Jen',  '壬', 6, bagua.bagua.qián,  bagua.bagua.kūn, ealierHeavenElements.Water, 'I'),
      new CelestialStem('Kuei', '癸', 2, bagua.bagua.kūn,  bagua.bagua.qián, ealierHeavenElements.Water, 'J'), 
    ];
    /** The numbers in the horary branch are from the Ho Map */
    this.horaryBranches = [
      new HoraryBranch('Tzu', '子',   [1, 6] , ealierHeavenElements.Water, 'a', 'Rat' ),
      new HoraryBranch(`Ch'ou`, '丑',  [5, 10], ealierHeavenElements.Earth, 'b', 'Ox' ),
      new HoraryBranch('Yin','寅',   [3,8], ealierHeavenElements.Wood, 'c', 'Tiger'),
      new HoraryBranch('Mao', '卯',   [3,8], ealierHeavenElements.Wood, 'd', 'Rabbit' ),
      new HoraryBranch(`Ch'en`, '辰', [5, 10] , ealierHeavenElements.Earth, 'e', 'Dragon' ),
      new HoraryBranch('Szu', '巳', [2,7], ealierHeavenElements.Fire, 'f', 'Snake' ),
      new HoraryBranch('Wu', '午',   [2,7], ealierHeavenElements.Fire, 'g', 'Horse' ),
      new HoraryBranch('Wei', '未',   [5, 10], ealierHeavenElements.Earth, 'h', 'Goat' ),
      new HoraryBranch('Shen', '申',  [4,9], ealierHeavenElements.Metal, 'i', 'Monkey' ),
      new HoraryBranch('Yu', '酉',   [4,9], ealierHeavenElements.Metal, 'j', 'Rooster' ),
      new HoraryBranch('Hsu', '戌',  [5, 10], ealierHeavenElements.Earth, 'k', 'Dog' ),
      new HoraryBranch('Hai', '亥',  [1, 6], ealierHeavenElements.Water, 'l', 'Pig' ),      
    ];
    /** Static Stems and Branches Stem is Upper Case, Branch is lower case, ApplicABLE Year - Stem and Branch */
    
    this.monthlyStemsAndBranches = [
      new MonthlyStemBranch('December_last_half', '+', ['Summer Solstice'],  {AF: "Hh", BG: "Jh", CH: "Bh", DI: "Dh", EJ: "Fh"}),
      new MonthlyStemBranch('January', '-', ['Slight Heat', 'Great Heat'],  {AF: "Hh", BG: "Jh", CH: "Bh", DI: "Dh", EJ: "Fh"}),
      new MonthlyStemBranch('February', '+', ['Autumn Begins', 'Limit of Heat'], {AF: "Ii", BG: "Ai", CH: "Ci", DI: "Ei", EJ: "Gi"} ),      
      new MonthlyStemBranch('March', '-', ['White Dew', 'Autumnal Equinox'],  {AF: "Jj", BG: "Bj", CH: "Dj", DI: "Fj", EJ: "Hj"}),
      new MonthlyStemBranch('April', '+', ['Cold Dew', 'Hoar Frost Descends'], {AF: "Ak", BG: "Ck", CH: "Ek", DI: "Gk", EJ: "Ik"}),
      new MonthlyStemBranch('May', '-', ['Winter Begins', 'Little Snow'], {AF: "Bl", BG: "Dl", CH: "Fl", DI: "Hl", EJ: "Jl"}),
      new MonthlyStemBranch('June', '+', ['Heavy Snow', 'Winter Solstice'], {AF: "Ca", BG: "Ea", CH: "Ga", DI: "Ia", EJ: "Aa"}),
      new MonthlyStemBranch('July', '-', ['Little Cold', 'Severe Cold'],  {AF: "Bb", BG: "Db", CH: "Fb", DI: "Hb",EJ: "Jb"}),
      new MonthlyStemBranch('August', '+', ['Spring Begins', 'Rain Water'], {AF: "Cc", BG: "Ec", CH: "Gc", DI: "Ic",EJ: "Ac"}),
      new MonthlyStemBranch('September', '-', ['Excited Insects', 'Vernal Equinox'], {AF: "Dd", BG: "Fd", CH: "Hd", DI: "Jd", EJ: "Bd"}),
      new MonthlyStemBranch('October', '+', ['Clear Bright', 'Grain Rains'], {AF: "Ee", BG: "Ge", CH: "Ie", DI: "Ae",EJ: "Ce"}),
      new MonthlyStemBranch('November', '-', ['Summer Begins', 'Grain Fills'], {AF: "Ff",BG: "Hf", CH: "Jf",  DI: "Bf", EJ: "Df"}),
      new MonthlyStemBranch('December_first_half', '+', ['Grain in Ear'],  {AF: "Gg", BG: "Ig", CH: "Ag", DI: "Cg", EJ: "Eg"})
    ];


   

    this.hourlyStemsBranches =
    [ new HourlyStemBranch(0, 1, {AF: "Aa", BG: "Ca", CH: "Ea", DI: "Ga", EJ: "Ia"}),
      new HourlyStemBranch(1, 3,  {AF: "Bb", BG: "Db", CH: "Fb", DI: "Hb", EJ: "Jb"}),
      new HourlyStemBranch(3, 5, {AF: "Cc", BG: "Ec", CH: "Gc", DI: "Ic", EJ: "Ac"} ),      
      new HourlyStemBranch(5, 7, {AF: "Dd", BG: "Fb", CH: "Hd", DI: "Jd", EJ: "Bd"}),
      new HourlyStemBranch(7, 9, {AF: "Ee", BG: "Ge", CH: "Ie", DI: "Ae", EJ: "Ce"}),
      new HourlyStemBranch(9, 11, {AF: "Ff", BG: "Hf", CH: "Jf", DI: "Bf", EJ: "Df"}),
      new HourlyStemBranch(11, 13, {AF: "Gg", BG: "Ig", CH: "Ag", DI: "Cg", EJ: "Eg"}),
      new HourlyStemBranch(13, 15, {AF: "Hh", BG: "Jh", CH: "Bh", DI: "Dh",EJ: "Fh"}),
      new HourlyStemBranch(15, 17, {AF: "Ii", BG: "Ai", CH: "Ci", DI: "Ei",EJ: "Gi"}),
      new HourlyStemBranch(17, 19, {AF: "Jj", BG: "Bj", CH: "Dj", DI: "Fj", EJ: "Hj"}),
      new HourlyStemBranch(19, 21, {AF: "Ak", BG: "Ck", CH: "Ek", DI: "Gk",EJ: "Ik"}),
      new HourlyStemBranch(21, 23, {AF: "Bl",BG: "Dl", CH: "Fl",  DI: "Hl", EJ: "Jl"}),
      new HourlyStemBranch(23, 0, {AF: "Ca", BG: "Ea", CH: "Ga", DI: "Ia", EJ: "Aa"})
    ];

    this.hourlySymbols = [
      new HourlySymbol(23, 1,  `a`, yao.yao.yang),
      new HourlySymbol(1, 3,  `b`, yao.yao.yang),
      new HourlySymbol(3, 5,  `c`, yao.yao.yang),
      new HourlySymbol(5, 7,  `d`, yao.yao.yang),
      new HourlySymbol(7, 9,  `e`, yao.yao.yang),
      new HourlySymbol(9, 11, `f`, yao.yao.yang),
      new HourlySymbol(11, 13, `g`, yao.yao.yin),
      new HourlySymbol(13, 15, `h`, yao.yao.yin),
      new HourlySymbol(15, 17, `i`, yao.yao.yin),
      new HourlySymbol(17, 19, `j`, yao.yao.yin),
      new HourlySymbol(19, 21, `k`, yao.yao.yin),
      new HourlySymbol(21, 23, `l`, yao.yao.yin),
    ];

    

    /** Heavenly Numbers for the Various Cycles and Genders */
    this.heavenlyNumbersUpperCycleMale = [
      new HeavenlyNumberTrigram(1, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(2, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(3, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(4, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(5, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(6, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(7, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(8, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(9, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(10, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(11, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(12, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(13, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(14, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(15, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(16, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(17, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(18, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(19, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(20, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(21, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(22, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(23, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(24, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(25, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(26, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(27, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(28, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(29, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(30, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(31, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(32, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(33, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(34, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(35, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(36, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(37, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(38, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(39, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(40, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(41, bagua.bagua.qián ),
      new HeavenlyNumberTrigram(42, bagua.bagua.duì ),
      new HeavenlyNumberTrigram(43, bagua.bagua.gèn ),
      new HeavenlyNumberTrigram(44, bagua.bagua.lí ),
      new HeavenlyNumberTrigram(45, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(46, bagua.bagua.kǎn ),
      new HeavenlyNumberTrigram(47, bagua.bagua.kūn ),
      new HeavenlyNumberTrigram(48, bagua.bagua.zhèn ),
      new HeavenlyNumberTrigram(49, bagua.bagua.xùn ),
      new HeavenlyNumberTrigram(50, bagua.bagua.gèn ),
    ];

    this.heavenlyNumbersUpperCycleFemale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersUpperCycleFemale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.kūn);
    this.heavenlyNumbersUpperCycleFemale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.kūn);

    this.heavenlyNumbersMiddleCycleMaleEvenFemaleOdd = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersMiddleCycleMaleOddFemaleEven = this.heavenlyNumbersUpperCycleFemale;

    this.heavenlyNumbersLowerCycleMale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersLowerCycleMale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.lí);
    this.heavenlyNumbersLowerCycleMale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.lí);

    this.heavenlyNumbersLowerCycleFemale = this.heavenlyNumbersUpperCycleMale;
    this.heavenlyNumbersLowerCycleFemale[4] = new HeavenlyNumberTrigram(5, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[14] = new HeavenlyNumberTrigram(15, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[24] = new HeavenlyNumberTrigram(25, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[29] = new HeavenlyNumberTrigram(30, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[39] = new HeavenlyNumberTrigram(40, bagua.bagua.duì);
    this.heavenlyNumbersLowerCycleFemale[49] = new HeavenlyNumberTrigram(50, bagua.bagua.duì);

  /** Heavenly Numbers for the Earthly Cycle */
  this.earthlyNumbers = [
    new EarthlyNumberTrigram(2, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(4, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(6, bagua.bagua.qián ),
    new EarthlyNumberTrigram(8, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(10, bagua.bagua.kǎn ),
    new EarthlyNumberTrigram(12, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(14, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(16, bagua.bagua.qián ),
    new EarthlyNumberTrigram(18, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(20, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(22, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(24, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(26, bagua.bagua.qián ),
    new EarthlyNumberTrigram(28, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(30, bagua.bagua.zhèn ),
    new EarthlyNumberTrigram(32, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(34, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(36, bagua.bagua.qián ),
    new EarthlyNumberTrigram(38, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(40, bagua.bagua.kǎn ),
    new EarthlyNumberTrigram(42, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(44, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(46, bagua.bagua.qián ),
    new EarthlyNumberTrigram(48, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(50, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(52, bagua.bagua.kūn ),
    new EarthlyNumberTrigram(54, bagua.bagua.xùn ),
    new EarthlyNumberTrigram(56, bagua.bagua.qián ),
    new EarthlyNumberTrigram(58, bagua.bagua.gèn ),
    new EarthlyNumberTrigram(60, bagua.bagua.zhèn ),    
  ];
    
    /** Compute Sexagenary Cycles based on combinations of Celestial stems and Horary Branches */
    this.sexagenaryCycle = [];
    this.initializeSexagenaryCycles();
  }

      initializeSexagenaryCycles() {
        let count = 0;
        let cycle = 0;
        for (let j = 0; j < 6; j++) {
          for (let i = 0; i < this.celestialStems.length; i++) {
            count++;
            this.sexagenaryCycle.push(new SexagenaryCycle(count, this.celestialStems[i], this.horaryBranches[cycle], count % 2 === 0 ? 'yin' : 'yang'));
            cycle++;
            if (cycle === 12) cycle = 0;
          }
        }
      }

      isLeapYear (year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };

      // Method to determine the winter solstice of a given year
      getWinterSolstice(year) {
        return DateTime.fromObject({ year: year, month: 6, day: 21 });
      }

        // Helper method to calculate the date from the day of the year
      calculateDateFromDayOfYear(year, dayOfYear) {
        const startDate = new Date(year, 0, 1); // January 1st of the year
        const targetDate = new Date(startDate.setDate(dayOfYear));
        return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Method to get the stem-branch combination for a specific day
      getDailyCycleForDay(dayIndex) {
        const stemIndex = (dayIndex - 1) % 10;
        const branchIndex = (dayIndex - 1) % 12;
        return {
          celestialStem: this.celestialStems[stemIndex],
          horaryBranch: this.horaryBranches[branchIndex],
        };
      }

      // Method to generate daily cycles for a given year based on the starting day
      generateYearlyDailyCycles(year, startingDay) {
        const daysInYear = this.isLeapYear(year) ? 366 : 365; // Adjust for leap years
        let dailyCycles = [];
        for (let day = 1; day <= daysInYear; day++) {
          let dayIndex = (startingDay + day - 2) % 60 + 1; // Adjust for starting day and wrap around 60-day cycle
          dailyCycles.push({
            day: day,
            date: this.calculateDateFromDayOfYear(year, day),
            ...this.getDailyCycleForDay(dayIndex),
          });
        }
        return dailyCycles;
      }

      // Helper method to calculate the offset for daily cycles for a given year
      getDailyCycleStart(year) {
        // Southern Hemisphere offset logic
        const baseYear = 1929;  // For Southern Hemisphere offset reference
        const increment = 5; // Increment per year, adjust if needed
        return ((year - baseYear) * increment % 60 + 60) % 60 + 1;
      }


  /** Get the Upper, Middle and Lower Reference Cycles as Defined By (Sherrill and Chu, 1976)  
   *  These cycles represent a starting point for calculating the sexagenary cycle
   *  for any given year in the past or future 
   * Southern Hemisphere yearly cycle calculations
   * 
  */
 
  getUpperCycle() {
    let cycle = [];
    for (let i = this.sexagenarySubCycle.upperCycle; i < this.sexagenarySubCycle.upperCycle + 60; i++) {
      cycle.push({year: i + 5.5, cycle: this.sexagenaryCycle[i - this.sexagenarySubCycle.upperCycle]});
    }
    return cycle;
  }

  getMiddleCycle() {
    let cycle = [];
    for (let i = this.sexagenarySubCycle.middleCycle; i < this.sexagenarySubCycle.middleCycle + 60; i++) {
      cycle.push({year: i + 5.5, cycle: this.sexagenaryCycle[i - this.sexagenarySubCycle.middleCycle]});
    }
    return cycle;
  }

  getLowerCycle() {
    let cycle = [];
    for (let i = this.sexagenarySubCycle.lowerCycle; i < this.sexagenarySubCycle.lowerCycle + 60; i++) {
      cycle.push({year: i + 5.5, cycle: this.sexagenaryCycle[i - this.sexagenarySubCycle.lowerCycle]});
    }
    return cycle;
  }

   getMonthlyStemsAndBranchesForaYear(year) {
      let results = [];
    
      // Adjust the Southern Hemisphere astrological year to start from June
      for (let month = 1; month <= 12; month++) {
        let monthStart = DateTime.fromObject({ year: year, month: month, day: 1 });
    
        // Adjust the cycle index for Southern Hemisphere
        let cycleIndex = ((year - 1929) % 60) * 12 + (month + 5) % 12; // Offset by 6 months
        let stemIndex = cycleIndex % 10;
        let branchIndex = cycleIndex % 12;
    
        let stem = this.celestialStems[stemIndex];
        let branch = this.horaryBranches[branchIndex];
    
        results.push({
          month: monthStart.toFormat('dd-MM-yyyy'),
          celestialStem: stem,
          horaryBranch: branch
        });
      }
    
      return results;
    }
    

    getMonthlyStemBranchForaYear (yearSymbol, month, day) {
      // Determine whether it's the first half or last half of December
      let targetMonth;
      if (month === 12) {
        if (day <= 15) {
          targetMonth = 'December_first_half';
        } else {
          targetMonth = 'December_last_half';
        }
      } else {
        // Convert month number to month name
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November'
        ];
        targetMonth = monthNames[month - 1];
      }
    
      // Find the matching monthly stem and branch object
      const monthlyStemBranch = this.monthlyStemsAndBranches.find(
        item => item.month === targetMonth
      );
    
      if (!monthlyStemBranch) {
        throw new Error('Invalid month or structure not found.');
      }
      console.log('monthlySteamAndBranch', monthlyStemBranch);
      // Find the correct applicableYear key that contains the yearSymbol
      const applicableYearKey = Object.keys(monthlyStemBranch.years).find(key => key.includes(yearSymbol));
    
      if (!applicableYearKey) {
        throw new Error('Year symbol does not match any applicable year type.');
      }
    
      // Get the stem and branch using the correct applicable year key
      const stemBranch = monthlyStemBranch.years[applicableYearKey];
    
      return {
        month: month,        
        monthName: targetMonth,
        symbols:stemBranch,
        celestialStem: this.getCelestialStemByAlpha(stemBranch.charAt(0)), // First character is the celestial stem
        horaryBranch:  this.getHoraryBranchByAlpha(stemBranch.charAt(1)),   // Second character is the horary branch
      };
    }

    getHourlyStemABranchForTimeAndSymbol(hour, minute, dailyStemSymbol) {
      // Convert time to hour integer
       // Find the matching hourly stem branch object
       const thehour = Math.floor(hour + minute / 60);
       
       const hourlyStemBranch = this.hourlyStemsBranches.find(item => {
         // Handle the 24-hour format and wrap-around (like 24-1 means 00:00 to 01:00)
         if (item.startHour < item.stopHour) {
           // Normal case (e.g., 1-3, 3-5)
           return thehour >= item.startHour && hour < item.stopHour;
         } else {
           // Wrap-around case (e.g., 23-1, which means 23:00 to 01:00)
           return (thehour >= item.startHour || hour < item.stopHour);
         }
       });
     
       if (!hourlyStemBranch) {
         throw new Error('Invalid time or no matching hourly stem branch found.');
       }
     
       // Find the correct applicable year key that contains the daily stem symbol
       const applicableYearKey = Object.keys(hourlyStemBranch.stemBranch).find(key => key.includes(dailyStemSymbol));
     
       if (!applicableYearKey) {
         throw new Error('Daily stem symbol does not match any applicable year type.');
       }
     
       // Get the stem and branch using the correct applicable year key
       const stemBranchSymbol = hourlyStemBranch.stemBranch[applicableYearKey]
 
       return {
         time: `${hour}:${minute}`,
         symbols:applicableYearKey,
         celestialStem: this.getCelestialStemByAlpha(stemBranchSymbol.charAt(0)), // First character is the celestial stem
         horaryBranch:  this.getHoraryBranchByAlpha(stemBranchSymbol.charAt(1)),   // Second character is the horary branch
       };
     }

    /** Get Full Sexagenary Cycle A particular Year Falls In 
     * Given a year, return the sexagenary cycle for that year based on the upper, middle and lower cycles each being 60 years
     * and the starting point for each cycle being 1869, 1929 and 1989 respectively
     * compute the correct cycle even if the year is before 1864 or after 1984, 
     * given the cycles follow a 60 year pattern and run from Upper → Middle → Lower → Upper → Middle → Lower and so on.
     */    

    getFullSexagenaryCycle(year) {
      const cycles = {
          upper: { start: 1989, end: 2048 },
          middle: { start: 1869, end: 1928 },
          lower: { start: 1929, end: 1988 }
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
          cycle.push({year: i,  cycle: this.sexagenaryCycle[i-cycleStart], dailyCycles: this.generateYearlyDailyCycles(i, this.getDailyCycleStart(i))});
        }
  
      return {
          cycleName: cycleName,
          startYear: cycleStart,
          endYear: cycleEnd,
          year: year,
          cycle: cycle,
      };

 }

 getYearSexagenaryObject(fullCycle, year) {
  let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
  return theCycle; 
}

  getYearSexagenaryCycle(year) {
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
    return theCycle.cycle; 
  }

  getYearSexagenaryDailyCycles(year) {
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);
    return theCycle.dailyCycles; 
  }
  /** Get a specific daily cycle for a year on date*/
  getYearSexagenaryDailyCycle(year, date) {
    // convert the date to format yyyy-mm-dd 
    let dateStr = date.split('T')[0];
    let fullCycle = this.getFullSexagenaryCycle(year);
    let theCycle = fullCycle.cycle.find(cycle => cycle.year === year);  
    let theDay = theCycle.dailyCycles.find(dailyCycle => dailyCycle.date === dateStr);
  
    return theDay; 
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
        return this.sexagenaryCycle.find(cycle => Number(cycle.number) === Number(number));
      }

     getMonthlyStemBranch(year, month) {
          const yearGroupIndex = (year - 1) % 10; // Calculate year group index
          const monthIndex = month === 12 && new Date().getDate() > 15 ? 'December_last_half' : 'December_first_half'; // Special handling for December
      
          // Find the month entry
          const monthEntry = this.monthlyStemsAndBranches.find(entry => entry.month === monthIndex);
          
          if (!monthEntry) {
            throw new Error('Invalid month provided');
          }
      
          // Return the relevant stem and branch for the year group
          return monthEntry.years[yearGroupIndex];
      }
  
     calculateDailyCycleValue(year, month, day) {
        /** Daily Cycle Values (Table 6) */
        const dailyCycleValues = {
          1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // January
          2: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58], // February
          3: [59, 60, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], // March
          4: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], // April
          5: [60, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // May
          6: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], // June
          7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], // July
          8: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2], // August
          9: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], // September
          10: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2, 3], // October
          11: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], // November
          12: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 1, 2, 3, 4] // December
        };
    
        // Adjust for leap year (from March onward)
        if (this.isLeapYear(year) && month >= 3) {
            day += 1; // Shift day by one for leap years starting in March
        }
       
        const dailyCycleValue = dailyCycleValues[month][day-1]; // Get the value based on month and day

    
        return dailyCycleValue;
        // Determine celestial stem and branch based on cycle value
        
    }

    getJulianDayNumber(date) {
      const dt = DateTime.fromISO(date, { zone: 'UTC' });
      const year = dt.year;
      const month = dt.month;
      const day = dt.day;
    
      let A = Math.floor((14 - month) / 12);
      let Y = year + 4800 - A;
      let M = month + 12 * A - 3;
    
      return day + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
    }

  /**  Function to calculate the sexagenary day number 
   * https://ytliu0.github.io/ChineseCalendar/sexagenary.html
  */
   getSexagenaryDay(date) {

     let jdNoon = this.getJulianDayNumber(date);
      const sexagenaryDay = 1 + ((jdNoon - 11) % 60);
      return sexagenaryDay <= 0 ? sexagenaryDay + 60 : sexagenaryDay;
  }

// Function to calculate the weekday number
   getWeekdayNumber(date) {
      let jdNoon = this.getJulianDayNumber(date);
    return (jdNoon + 1) % 7;
}





}


class IChingConsultation {
  constructor(astrology) {
    this.astrology = astrology; // Instance of IChingAstrology
  }

  async consultOracle(birthDateTime, gender = Gender.MALE, latitude, longitude) {
    // Step 1: Calculate the true astrological local time
    console.log('-----------------------------------------');

    const jsDate = new Date(birthDateTime);
    console.log('raw', jsDate);
    const trueLocalDateTime = DateTime.fromJSDate(jsDate);
    //const trueLocalDateTime = this.calculateTrueLocalTime(DateTime.fromJSDate(jsDate), latitude, longitude);
    console.log('trueLocalDateTime', trueLocalDateTime);
    const dateStr = trueLocalDateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss").toString()
    console.log('trueLocalDateTime',dateStr);

    // Extract year, month, day, and hour for further calculations
    const year = trueLocalDateTime.year;
    const month = trueLocalDateTime.month;
    const day = trueLocalDateTime.day;
    const hour = trueLocalDateTime.hour;
    const minute = trueLocalDateTime.minute;

    const fullCycle = this.astrology.getFullSexagenaryCycle(year);
    console.log('fullCycle', fullCycle);
    // Step 2: Get the yearly cycle number
    const yearlyCycle = this.astrology.getYearSexagenaryObject(fullCycle, year);
    console.log('yearlyCycle', yearlyCycle);

    // Step 3: Find symbols for the year
    const yearSymbols = yearlyCycle.cycle.celestialStem.alphabeticOrder + yearlyCycle.cycle.horaryBranch.alphabeticOrder;
    console.log('yearSymbols', yearSymbols);

    // Step 4: Convert yearly symbols to numbers
    const yearNumbers = this.getSymbolNumbers(yearlyCycle.cycle.celestialStem, yearlyCycle.cycle.horaryBranch);
    console.log('yearNumbers', yearNumbers);
    // Step 5: Determine the astrological month
    const monthlyStemBranch = this.astrology.getMonthlyStemBranchForaYear(yearlyCycle.cycle.celestialStem.alphabeticOrder, month, day);
    console.log('monthlyStemBranch', monthlyStemBranch);
    // Step 6: Find monthly symbols
    const monthSymbols = monthlyStemBranch.celestialStem.alphabeticOrder + monthlyStemBranch.horaryBranch.alphabeticOrder;
    console.log('monthSymbols', monthSymbols);
    // Step 7: Convert monthly symbols to numbers
    const monthNumbers = this.getSymbolNumbers(monthlyStemBranch.celestialStem, monthlyStemBranch.horaryBranch);
    console.log('monthNumbers', monthNumbers);
     // Step 8: Find daily cycle Value
    const dailyCycleValue = this.astrology.calculateDailyCycleValue(year, month, day);
    console.log('dailyCycleValue', dailyCycleValue);
    // Step 9: Find daily cycle number for the year
    const dailyCycle = this.astrology.getYearSexagenaryDailyCycle(year, dateStr);
    console.log('dailyCycle', dailyCycle);

   

       // Step 10: Correctly calculate the daily sum using the homap numbers of the daily cycles
       // unnecessary with new formula
       // const dailySum = this.calculateDailySum(dailyCycleValue, dailyCycle.day);

     let   dailySum = this.astrology.getSexagenaryDay(dateStr);

    console.log('dailySum', dailySum);
      // Step 11: Find daily symbols using the sum (dailySum % 60);
      if (dailySum != 60) {
        dailySum = dailySum % 60;
      };
   const dailyStemBranch = this.astrology.getSexagenaryCycleByNumber(dailySum);
   console.log('dailyStemBranch', dailyStemBranch);
    // Step 12: Convert daily symbols to numbers
   const dailySymbols = dailyStemBranch.celestialStem.alphabeticOrder + dailyStemBranch.horaryBranch.alphabeticOrder;
    console.log('dailySymbols', dailySymbols);    
   // Step 12: Convert daily symbols to numbers
    const dailyNumbers = this.getSymbolNumbers(dailyStemBranch.celestialStem, dailyStemBranch.horaryBranch);
    console.log('dailyNumbers', dailyNumbers);
     // Step 13: Find hourly symbols
     const hourlyStemBranch = this.astrology.getHourlyStemABranchForTimeAndSymbol(hour, minute,   dailyStemBranch.celestialStem.alphabeticOrder);
    console.log('hourlyStemBranch', hourlyStemBranch); 
     
    //  return {
    //   time: time24hr,
    //   symbols:applicableYearKey,
    //   celestialStem: this.getCelestialStemByAlpha(stemBranchSymbol.charAt(0)), // First character is the celestial stem
    //   horaryBranch:  this.getHoraryBranchByAlpha(stemBranchSymbol.charAt(1)),   // Second character is the horary branch
    // };

     const hourlySymbols = hourlyStemBranch.celestialStem.alphabeticOrder + hourlyStemBranch.horaryBranch.alphabeticOrder;
      console.log('hourlySymbols', hourlySymbols);
     // Step 14: Convert hourly symbols to numbers
     const hourlyNumbers = this.getSymbolNumbers(hourlyStemBranch.celestialStem, hourlyStemBranch.horaryBranch);
      console.log('hourlyNumbers', hourlyNumbers);
 
     // Step 15-16: Calculate heavenly and earthly numbers
     const allNumbers = [...yearNumbers, ...monthNumbers, ...dailyNumbers, ...hourlyNumbers];

     console.log('allNumbers', allNumbers);
     

     let heavenlyNumber = allNumbers.filter(n => n % 2 !== 0).reduce((acc, val) => acc + val, 0); // Sum of odd numbers
     console.log('heavenlyNumber', heavenlyNumber);

     let earthlyNumber = allNumbers.filter(n => n % 2 === 0).reduce((acc, val) => acc + val, 0); // Sum of even numbers
      console.log('earthlyNumber', earthlyNumber);

      // if heavenly number > 50, swap the numbers around. To Do: Figure out why this happens???!!
      // only seems to happen between 17:00 and 19:00 in 1970 January 17th
      if (heavenlyNumber > 50) {
        // const temp = heavenlyNumber;
        // heavenlyNumber = earthlyNumber;
        // earthlyNumber = temp;
        // console.log('Swapped Numbers as heavenlyNumber > 50');
        let original = heavenlyNumber;
        heavenlyNumber -= 50;
        console.log('original heavenlyNumber (' + original + ') adjusted to below 50: ', heavenlyNumber);
      }

      
      if (earthlyNumber > 60) {
        // const temp = heavenlyNumber;
        // heavenlyNumber = earthlyNumber;
        // earthlyNumber = temp;
        // console.log('Swapped Numbers as heavenlyNumber > 50');
        let original = earthlyNumber;
        earthlyNumber -= 60;
        console.log('original earthlyNumber (' + original + ') adjusted to below 60: ', earthlyNumber);
      }

     let heavenlyTrigram = null; let earthlyTrigram = null; let preHeavenHexagram = null;
     let birthYearIsOdd = year % 2 !== 0;

     console.log(birthYearIsOdd);

     // determine which cycle we are in and based on that calculate the correct heavenly and earthly trigrams
     // also include the gender to determine the correct heavenly trigram
     switch (fullCycle.cycleName) {
      case 'upper':
         if (gender == Gender.MALE) {
            heavenlyTrigram = this.astrology.heavenlyNumbersUpperCycleMale.find(trigram => trigram.number === heavenlyNumber);       
          } 
          else {
            heavenlyTrigram = this.astrology.heavenlyNumbersUpperCycleFemale.find(trigram => trigram.number === heavenlyNumber);         
          }
        break;
      case 'middle':
        // Determine whether the BirthYear is odd or even    
     
        if (  (birthYearIsOdd && gender == Gender.MALE ) || (!birthYearIsOdd && gender == Gender.FEMALE) ) {
          heavenlyTrigram = this.astrology.heavenlyNumbersMiddleCycleMaleOddFemaleEven.find(trigram => trigram.number === heavenlyNumber);          
        }
        if (  (birthYearIsOdd && gender == Gender.FEMALE ) || (!birthYearIsOdd && gender == Gender.MALE) ) {
          // birthYear is even and gender is male or birthYear is odd and gender is female
          heavenlyTrigram = this.astrology.heavenlyNumbersMiddleCycleMaleEvenFemaleOdd.find(trigram => trigram.number === heavenlyNumber);
        }
        break;
      case 'lower':
        if (gender == Gender.MALE) {
          heavenlyTrigram = this.astrology.heavenlyNumbersLowerCycleMale.find(trigram => trigram.number === heavenlyNumber);     
        } 
        else {
          heavenlyTrigram = this.astrology.heavenlyNumbersLowerCycleFemale.find(trigram => trigram.number === heavenlyNumber);         
        }
        
        
        break;   
     }

     earthlyTrigram = this.astrology.earthlyNumbers.find(trigram => trigram.number === earthlyNumber);

     // Now determine which trigram goes on top and which on the bottom to construct the Pre-Heaven Hexagram
     // The rule is as follows: For Gender.MALE if the year of birth is even, the heavenly trigram goes on top and earthly at the bottom, for odd years the earthly trigram goes on top and the heavenly at the bottom
     // For Gender.FEMALE if the year of birth is even, the heavenly trigram goes at the bottom and earthly on top. For odd years the heavenly trigram is on top earthly trigram goes on bottom

      if ((!birthYearIsOdd && gender == Gender.MALE ) || (birthYearIsOdd && gender == Gender.FEMALE))
        {          
          preHeavenHexagram = hexagram.getHexagramByAboveBelow(heavenlyTrigram.trigram, earthlyTrigram.trigram);          
        }
      if ((birthYearIsOdd && gender === Gender.MALE) || (!birthYearIsOdd && gender == Gender.FEMALE))
        {       
         preHeavenHexagram = hexagram.getHexagramByAboveBelow(earthlyTrigram.trigram, heavenlyTrigram.trigram);
        }
 
     return {
      birthDateTime,
      trueLocalDateTime,
      sexagenaryCycle: fullCycle,
      yearly: {
        year,
        yearlyCycle,
        yearSymbols,
        yearNumbers,
      },
      monthly: {
        monthlyStemBranch,
        monthSymbols,
        monthNumbers,
      },
      daily:{
        dailyCycleValue,
        dailyCycle,
        dailySum,
        dailyStemBranch,
        dailyNumbers,
        dailySymbols,
      },      
      hourly: {
        hour,
        hourlySymbols,        
        hourlyNumbers,
      },
      iching :{
        heavenlyNumber,
        earthlyNumber,
        heavenlyTrigram,
        earthlyTrigram,
        preHeavenHexagram,
        stemBranchNumbers: allNumbers,
      }   
     };

  }

  // Helper function to calculate the daily sum using hoMap numbers from celestialStem and horaryBranch objects
  calculateDailySum(dailyCycleValue, dailyCycle) {
   // find the sexaginary cycle that corresponds to the dailycyclevalue + dailyCycle
   let dailySum = Number(dailyCycleValue) + Number(dailyCycle);   
     return dailySum;
  }

  // Function to convert symbols to numbers based on Table 1
  getSymbolNumbers(celestialStem, horaryBranch) {
    const stemNumber = celestialStem.getHoMapNumber(); // Use hoMapNumber for CelestialStem
    const branchNumbers = horaryBranch.getHoMapNumbers(); // Use hoMapNumbers array for HoraryBranch
    return [stemNumber, ...branchNumbers]; // Return combined numbers
  }

  // Function to calculate the true local time
  calculateTrueLocalTime(birthDateUTC, latitude, longitude) {
    // Constants
    const referenceLongitude = 120; // 120 degrees east
    const degreesPerHour = 15; // 360 degrees / 24 hours
    const utcOffset = (longitude - referenceLongitude) / degreesPerHour; // Offset in hours
  
    // Create a Luxon DateTime object from the UTC birth date
    const utcDateTime = DateTime.fromISO(birthDateUTC, { zone: 'utc' });
  
    // Adjust the time by the UTC offset
    let localDateTime = utcDateTime.plus({ hours: utcOffset });
  
    // Determine if DST is applicable
    // Check if the date falls in a region that observes DST and adjust accordingly
    const isDST = localDateTime.isInDST; // Note: You'll need to define DST rules for specific regions
  
    // Example of applying DST (this may vary based on the specific region)
    if (isDST) {
      localDateTime = localDateTime.plus({ hours: 1 }); // Adjust for DST
    }
  
    return localDateTime; // Return the true local time as a string
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

    

  generateYearlyDailyCycles(year, startingDay) {
    const daysInYear = this.isLeapYear(year) ? 366 : 365; // Handle leap years
    let dailyCycles = [];

    for (let day = 1; day <= daysInYear; day++) {
        const date = this.calculateDateFromDayOfYear(year, day);
        const [yearPart, monthPart, dayPart] = date.split('-').map(Number);

        // Get daily cycle value
        const dailyCycle = this.calculateDailyCycleValue(yearPart, monthPart, dayPart);

        // Get hourly cycles for this day
        const hourlyCycles = [];
        for (let hour = 0; hour < 24; hour += 2) {
            hourlyCycles.push(this.calculateHourlyCycleForDate(DateTime.fromObject({ year: yearPart, month: monthPart, day: dayPart }), hour));
        }

        dailyCycles.push({
            day: day,
            date: date,
            ...dailyCycle,
            hourlyCycles
        });
    }
    return dailyCycles;
  }


}

export default {
  magicSquareOfThree,
  laterHeavenElements,
  ealierHeavenElements,  
  SexagenaryCycle,
  CelestialStem,
  HoraryBranch,
  IChingAstrology_North,
  IChingAstrology_South,
  IChingConsultation,
  IChingAstrologyManual,
  hexagramAstrology,
  calculateTrueLocalTime,
  getSolarTerm,
  determineSubCycle,
  computeSexagenaryCycle,
  calculateNatalHexagram,
  Gender,  
}