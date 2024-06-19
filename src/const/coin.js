import _ from 'lodash';

const tails = 2;
const heads = 3;
const oldyin = 6; // changing yin
const youngyin = 8; // unchainging yin
const youngyang = 7; // unchanging yang
const oldyang = 9; // changing yang
const yin = '0';
const yang = '1';

/** Toss a Coin to Generate a Heads or a Tail */
function tossCoin() {    
    return Math.floor(Math.random() * 2) === 0 ? tails : heads;
}

/** Toss a Special Coin to Generate a Heads or a Tail
 * This coin is used to determine whether a line
 * remains as is or changes (used to simulate the yarrow stalk method)
 */
function tossSpecialCoin() {    
    let ans = Math.floor(Math.random() * 2) === 0 ? tails : heads;
    switch (ans)
    {
    case tails:  oldyang;
    case heads: youngyang;
    }

}

/** Transform a coin sum hexagram into binary  */
function transformCoinHexagramToBinary(coinHexagram) {   
    let binary = '';
    for (let i = 0; i < 6; i++) { 
        switch ( coinHexagram[i]) { 
            case oldyin: binary += yin; break;
            case youngyang: binary += yang;  break;     
            case youngyin:  binary += yin; break;
            case oldyang:  binary += yang; break;
            default: console.log('error in transformCoinHexagrams', i);       
        }    
    }
    return binary;
}

/** Transform a coin sum hexagram into two binary based trigrams  */
function transformCoinHexagramToTrigrams(coinHexagram) {
    let topTrigram = '';
    let bottomTrigram = '';
    let binary = '';
    for (let i = 0; i < 6; i++) { 
        switch ( coinHexagram[i]) { 
            case oldyin: binary += yin; break;
            case youngyang: binary += yang;  break;     
            case youngyin:  binary += yin; break;
            case oldyang:  binary += yang; break;
            default: console.log('error in transformCoinHexagrams', i);       
        }    
    }
    topTrigram = binary.slice(0, 3);
    bottomTrigram = binary.slice(3,6);
    return [topTrigram, bottomTrigram];
}


/** Take a single coin generated hexagram and work out the changing lines
 *  to produce the primary and secondary hexagrams
 *  in heads and tails format
 */
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
   
    // reverse the array because hexagrams are constructed bottom up
    let newHexagram = [];
    for (let i = 0; i < 6; i++) {    
        newHexagram.push(coinHexagram.pop());
    }

  
    return newHexagram;
}


/** Generate a hexagram using the coin toss method 
 * return the primary hexagram and secondary hexagram
 * as an array consisting of the two hexagrams as arrays of trigrams
*/
function generateHexagramAndSecondaryHexagramTrigrams() {
    let coinHexagram = generateCoinHexagram();  
    let transformed = generateSecondaryCoinHexagram(coinHexagram);   
    let primary = transformCoinHexagramToTrigrams(coinHexagram);
    let secondary = transformCoinHexagramToTrigrams(transformed);   
    return [primary, secondary];
}

// generate iching hexagrams using the coin toss method. There are three seperate approaches
// to the coin toss method, each with different probabilities. The three methods are:

// Three-coin method

// Two heads and one tail of the original I-Ching Divination Coins.
// The three-coin method came into use over a thousand years after the yarrow-stalk method. 
// The quickest, easiest, and most popular method by far, it has largely supplanted yarrow stalks,
// but produces outcomes with different likelihoods. 
// Three coins are tossed at once; each coin is given a value of 2 or 3, depending upon whether it is tails or heads, respectively. Six such tosses make the hexagram. Some fortune-tellers use an empty tortoise shell to shake the coins in before throwing them on a dish or plate.

// Modified Three-coin method
// The three-coin method can be modified to have the same probabilities as the yarrow-stalk method by having one of the coins be of a second coin type, or in some way be marked as special (i.e., be distinguishable from the other coins). All three coins are tossed at once. The results are counted just as in the original three-coin method, with two exceptions: one to make yin less likely to move, and one to make yang more likely to move. (The probability for 6/8/9/7 in the coin method is 2/6/2/6, but in the yarrow-stalk method is 1/7/3/5; hence, 6 has to occur less often, and 9 has to occur more often.)

// In the case where the special coin is tails and the other two are both tails—which would normally produce a 6—re-flip the marked coin: if it remains tails, then it remains a 6 (moving yin); otherwise, treat it as an 8 (static yin). As a 6 can become a 6 or an 8, it reduces the probability of the moving 6. In other words, it makes the old yin less likely to change (or move).

// In the case where the special coin is heads and the other two are both tails—which would normally produce a 7—re-flip the marked coin: if it remains heads, then it remains as a 7 (static yang); otherwise, it becomes a 9 (moving yang). As a 7 can become a 7 or an 9, it reduces the probability of the static 7. In other words, it makes the young yang less likely and hence more yangs change as a result.

// This method retains the 50% chance of yin:yang, but changes the ratio of moving yin to static yin from 1:3 to 1:7; likewise, it changes the ratio of moving yang to static yang from 1:3 to 3:5, which is the same probabilities as the yarrow-stalk method.

// Two-coin method
// Some purists contend that there is a problem with the three-coin method because its probabilities differ from the more ancient, yarrow-stalk, method. In fact, over the centuries there have even been other methods used for consulting the oracle.

// The two-coin method involves tossing one pair of coins twice: on the first toss, two heads give a value of 2, and anything else is 3; on the second toss, each coin is valued separately, to give a sum from 6 to 9, as above. This results in the same distribution of probabilities as for the yarrow-stalk method.
// create functions to generate hexagrams based on the three-coin method, modified three-coin method, and two-coin method as detailed in the text immediately above.

// generate the code for a single toss of three coins

 





export default
{
    tossCoin,
    generateCoinHexagram,
    generateSecondaryCoinHexagram,   
    transformCoinHexagramToBinary,
    transformCoinHexagramToTrigrams,
    generateHexagramAndSecondaryHexagramTrigrams,
    
}

