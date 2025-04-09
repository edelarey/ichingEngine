import _ from 'lodash';

const tails = 2;
const heads = 3;
const oldyin = 6; // changing yin
const youngyin = 8; // unchanging yin
const youngyang = 7; // unchanging yang
const oldyang = 9; // changing yang
const yin = '0';
const yang = '1';

/** Toss a Coin to Generate a Heads or a Tail */
function tossCoin() {    
    return Math.floor(Math.random() * 2) === 0 ? tails : heads;
}

/** Generate a Single Line Using the Three-Coin Method */
function generateCoinLine() {
    // Toss three coins and sum their values
    const tosses = [tossCoin(), tossCoin(), tossCoin()];
    const sum = tosses.reduce((a, b) => a + b, 0);
    return sum; // Returns a value (6, 7, 8, or 9)
}

/** Check if a Line is a Changing Line */
function isChangingLine(lineValue) {
    return lineValue === oldyin || lineValue === oldyang; // 6 (old yin) or 9 (old yang) are changing lines
}

/** Transform a coin sum hexagram into binary */
function transformCoinHexagramToBinary(coinHexagram) {   
    let binary = '';
    for (let i = 0; i < 6; i++) { 
        switch (coinHexagram[i]) { 
            case oldyin: binary += yin; break;
            case youngyang: binary += yang; break;     
            case youngyin: binary += yin; break;
            case oldyang: binary += yang; break;
            default: console.log('error in transformCoinHexagrams', i);       
        }    
    }
    return binary;
}

/** Transform a coin sum hexagram into two binary-based trigrams */
function transformCoinHexagramToTrigrams(coinHexagram) {
    let topTrigram = '';
    let bottomTrigram = '';
    let binary = '';
    for (let i = 0; i < 6; i++) { 
        switch (coinHexagram[i]) { 
            case oldyin: binary += yin; break;
            case youngyang: binary += yang; break;     
            case youngyin: binary += yin; break;
            case oldyang: binary += yang; break;
            default: console.log('error in transformCoinHexagrams', i);       
        }    
    }
    topTrigram = binary.slice(0, 3);
    bottomTrigram = binary.slice(3, 6);
    return [topTrigram, bottomTrigram];
}

/** Take a single coin-generated hexagram and work out the changing lines to produce the secondary hexagram */
function generateSecondaryCoinHexagram(coinHexagram) {
    let secondaryHexagram = [];
    for (let i = 0; i < 6; i++) {    
        let sum = coinHexagram[i];     
        switch (sum) {
            case oldyin: secondaryHexagram.push(youngyang); break;
            case youngyang: secondaryHexagram.push(youngyang); break;     
            case youngyin: secondaryHexagram.push(youngyin); break;
            case oldyang: secondaryHexagram.push(youngyin); break;
            default: console.log('error in generateSecondaryHexagram', sum);
        }
    }     
    return secondaryHexagram;
}

/** Generate a Hexagram by constructing it bottom up */
function generateCoinHexagram() {
    let lineHexagram = [];
    let coinHexagram = [];
    for (let i = 0; i < 6; i++) {    
        lineHexagram.push([tossCoin(), tossCoin(), tossCoin()]);
    } 
    for (let i = 0; i < 6; i++) {    
        let sum = lineHexagram[i].reduce((a, b) => a + b, 0);     
        coinHexagram.push(sum);
    } 
   
    // Reverse the array because hexagrams are constructed bottom up
    let newHexagram = [];
    for (let i = 0; i < 6; i++) {    
        newHexagram.push(coinHexagram.pop());
    }
    return newHexagram;
}

/** Get the changing lines */
function getChangingLines(coinHexagram) {
    let changingLines = []; 
    for (let i = 0; i < 6; i++) {    
        let sum = coinHexagram[i];     
        switch (sum) {
            // Note: When displaying the hexagram, we read from the bottom up, so 6->1, 5->2, 4->3, 3->4, 2->5, 1->6
            case oldyin: changingLines.push(6 - i); break;
            case oldyang: changingLines.push(6 - i); break;
            default: ; // Do nothing
        }
    }
    return changingLines;
}

export default {
    oldyang,
    youngyang,
    oldyin,
    youngyin,    
    getChangingLines,
    tossCoin,
    generateCoinLine, // New function for line-by-line generation
    isChangingLine,  // New function to check if a line changes
    generateCoinHexagram,
    generateSecondaryCoinHexagram,   
    transformCoinHexagramToBinary,
    transformCoinHexagramToTrigrams,
}