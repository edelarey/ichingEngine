/**
 * bagua.js
 * @fileoverview bagua.js contains the bagua object and its methods.
 * @package bagua
 * @version 0.0.1
 * @requires color
 * @requires yao
 * @requires wordandsymbol
 * @description Const representing the 8 Trigrams in OLD FAMILY Order
 *   trans-literations according Bent Nielson, Wilhelm Reich & Walter"
 *	 "OLD FAMILY ORDER encodes binary order, New family order colour spectrum
 *   reference: 
 *          "Tao of Chaos",
			author = "Walter, K",
			date = "1994",
			publisher = "Element",
			page = "120","123"
			description = "Colors associated with Trigrams"
 */

const Color = require("color");
import yao from '@/const/yao';


const bagua = {
    kūn: {
        name: "kūn",
        symbol:  "坤",
        trigram: '☷',
        order: 0,
        binary: "000",
        lines:{
            upperLine: yao.yao.yin,        
            middleLine: yao.yao.yin,
            lowerLine: yao.yao.yin,
        },
        description: {
            alternate: "kūn",
            translation: "the Receptive, Field",
            oldfamilydirection: "southwest",
            oldfamilyrelationship: "mother",
            newfamilyrelationship: "mother",
            bodyPart:"stomach",
            attribute: "devoted, yielding",
            state: "receptive",
            animal: "ox," + "牛",
            nature: "earth," + "地",
            color: Color.rgb(	0, 0, 0), // black
        },
    },
    gèn: {
        name: "gèn",
        symbol: "艮",
        trigram: '☶',
        order:1,
        binary: "100", 
        lines:{
            upperLine: yao.yao.yang,        
            middleLine: yao.yao.yin,
            lowerLine: yao.yao.yin,
        },    
        description: {
            alternate: "Kên", 
            translation: "keeping Still, bound",
            oldfamilydirection: "north",
            oldfamilyrelationship: "second son",
            newfamilyrelationship: "second daughter",
            bodyPart:"hands",
            attribute: "still",
            state: "stopping",
            animal: "dog" + "狗",
            nature: "mountain" + "山",
            color: Color.rgb(	255, 0, 0), // red
        },     
    },
    kǎn: {
        name: "kǎn",
        symbol: "坎",
        trigram: '☵',
        order:2,
        binary: "010",
        lines:{
            upperLine: yao.yao.yin,
            middleLine: yao.yao.yang,
            lowerLine: yao.yao.yin,
        },
        description: {
        alternate: "K'an",
        translation: "the abysmal, gorge",
        oldfamilydirection: "north",
        oldfamilyrelationship: "second daughter",
        newfamilyrelationship: "second son",
        bodyPart:"ear",
        attribute: "dangerous",
        state: "in-motion",
        animal: "pig," + "豕",
        nature: "water, moon" + "水",
        color: Color.rgb(	0, 0, 255), // blue
        },       
    }, 
    xùn: {
        name: "xùn",
        symbol: "巽",
        trigram: '☴',
        order: 3, 
        binary: "110", 
        lines:{
            upperLine: yao.yao.yang,
            middleLine: yao.yao.yin,
            lowerLine: yao.yao.yin,
        },        
        description: {
        alternate: "Hsün",
        translation: "the gentle, ground",
        oldfamilydirection: "south-east",
        oldfamilyrelationship: "first daughter",
        newfamilyrelationship: "first daughter",
        bodyPart:"thigh",
        attribute: "penetrating",
        state: "gentle entrance",
        animal: "cock," + "雞",
        nature:"wind, wood," + "風",
        color:Color.rgb(	0, 255, 0), // green
        },
    },
    zhèn: {
        name: "zhèn",
        symbol: "震",
        trigram: '☳',
        order: 4, 
        binary: "001",       
        lines:{
            upperLine: yao.yao.yin,
            middleLine: yao.yao.yin,
            lowerLine: yao.yao.yang,
        },
        description: {
        alternate: "zhèn",
        translation:  "inciting movement, the arousing, shake",
        oldfamilydirection: "east",
        oldfamilyrelationship: "first son",
        newfamilyrelationship: "first son",
        bodyPart:"foot",
        attribute: "inciting movement",
        state: "initiative",
        animal: "dragon," + "龍",
        nature:"thunder," + "雷",
        color:Color.rgb(	255, 255, 0), // yellow 
        },
    },
    lí:{
        name: "lí",
        symbol: "離",
        trigram: '☲',
        order: 5,
        binary: "101",
        lines:{
            upperLine: yao.yao.yang,
            middleLine: yao.yao.yin,
            lowerLine: yao.yao.yang,
        },
        description: {
        aletrnate: "lí",
        translation: "the clinging, radiance",
        oldfamilydirection: "south",
        oldfamilyrelationship: "second son",
        newfamilyrelationship: "second daughter",
        bodyPart:"eye",
        attribute: "light-giving, dependence",
        state: "clinging, clarity, adaptable",
        animal: "pheasant," + "雉",
        nature:"fire, sun," + "火",
        color:Color.rgb(	255, 0, 255), // magenta
        },        
    },
    duì: {
        name: "duì",        
        symbol: '兌', 
        trigram: '☱',
        order: 6,  
        binary: "011",
        lines:{
            upperLine: yao.yao.yin,
            middleLine: yao.yao.yang,
            lowerLine: yao.yao.yang,
        },
        description: {
        alternate: "tuì",
        translation: "the joyous, open",
        oldfamilydirection: "west",
        oldfamilyrelationship: "third son",
        newfamilyrelationship: "third daughter",
        bodyPart:"mouth",
        attribute: "pleasure",
        state: "tranquil, complete devotion",
        animal: "sheep," + "羊",
        nature:"marsh, lake, swamp," + "澤",
        color:Color.rgb(	255, 0, 0), // red
        },        
    },
    qián: {
        name: 'qián',
        symbol: '乾', 
        trigram: '☰',
        order: 7,  
        binary: '111', 
        lines:{
            upperLine: yao.yao.yang,
            middleLine: yao.yao.yang,
            lowerLine: yao.yao.yang,
        },
        description: {       
        alternate: "Ch'ien",
        translation: "the creative, force",
        oldfamilydirection: "north-west",
        oldfamilyrelationship: "father",
        newfamilyrelationship: "father",
        bodyPart:"head",
        attribute: "strong, powerful",
        state: "creative, strong-willed",
        animal: "horse," + "馬",
        nature:"heaven, sky," + "天",
        color:Color.rgb(	255, 255, 255), // white
        },
        
    },
};  

/**
 * @IExplanation(name = "BaGua",
description="Enumeration representing the Trigrams in OLD FAMILY Order  trans-literations according Bent Nielson, Wilhelm Reich & Walter" +
		"OLD FAMILY ORDER encodes binary order, New family order colour spectrum ")
@IReference(title = "Tao of Chaos",
author= "Walter, K",
date= "1994",
publisher = "Element",
page ="122",
description = "The OLD Family order counts in binary code from 0 to 7")
 * @returns {Array} of trigrams in old family order
 */
function sequence_Gua_OldFamilyOrder ()
    {  
        return  [bagua.kūn, bagua.gèn, bagua.kǎn, bagua.xùn, bagua.zhèn, bagua.lí, bagua.duì, bagua.qián]};

/* @IReference(title = "Toa of Chaos",
			author = "Walter, K",
			date = "1994",
			publisher = "Element",
			page = "123",
			description = "linear order in new family i.e. color spectrum complement order." +
					"black, green, orange,red, purple,blue,yellow,white" +
					"Hexagram 1 moves to 4th position when lined up, Hexagram 5 in the third " +
					"They complement each other in light specturm (on a circle)." +
					"green = north")
	@IExplanation(name = "newfamilycolourcomplement_positionalOrder",
			description = "The positonal shift of each binary ordered trigram to generate the newfamilycolourcomplement. " +
					"So hexagram 4 in the binary enumeration is the 2nd element in the new list. " +
					"Ordinally hexagram with decimal & biinary value of 4 is at poisition 1 in the new list with 0 at position 0 (out of 0-7 positions)" +
					"but its index value will be 1, and its binary value in decimal remains 4 in the newfamilycolourcomplment order")
    @returns {Array} of hexagrams in new family order with colour spectrum complement order
**/
function sequence_Gua_NewFamilyOrder_ColourComplement_PositionalShift ()
    {return  [bagua.kūn, bagua.zhèn, bagua.lí, bagua.gèn, bagua.duì, bagua.kǎn, bagua.xùn, bagua.qián]};

/*@IReference(title = "Toa of Chaos",
			author = "Walter, K",
			date = "1994",
			publisher = "Element",
			page = "123",
			description = "linear order in new family i.e. Light Spectrum Order." +
					"Black, Green, Orange, Red, Purple, Blue, Yellow, White")
	@IExplanation(name = "sequence_Gua_NewFamilyOrder_LightSpectrum_TraversalOrder",
			description = "The traversal order of the enumeration (internal binary and ordinal) sequence to generate the Light Spectrum order." +
					"Walk the internal list in this order to get the correct sequence - zero being the start of the list." +
					"Thus write 0th trigram followed by third enumeration trigram etc.")
    @returns {Array} of hexagrams in new family order with light spectrum order
**/
    function sequence_Gua_NewFamilyOrder_LightSpectrum_TraversalOrder()
    {
      return [bagua.kūn, bagua.xùn, bagua.lí, bagua.duì, bagua.gèn, bagua.kǎn, bagua.zhèn, bagua.qián];
    };

    /* 
    @IReference(title = "Toa of Chaos",
			author = "Walter, K",
			date = "1994",
			publisher = "Element",
			page = "123",
			description = "linear order in old family i.e. Paint Spectrum Order." +
					"black, Yellow, Orange, Red, Purple, Blue, Green, White")
	@IExplanation(name = "sequence_Gua_NewFamilyOrder_LightSpectrum_TraversalOrder",
			description = "The traversal order of the enumeration (internal binary and ordinal) sequence to generate the Paint Spectrum order." +
					"Walk the internal list in this order to get the correct sequence - zero being the start of the list." +
					"Thus write 0th trigram followed by third enumeration trigram etc.")

    **/
    function sequence_Gua_NewFamilyOrder_PaintSpectrum_TraversalOrder()
    {
        return  [bagua.kūn, bagua.gèn, bagua.kǎn, bagua.xùn, bagua.zhèn, bagua.lí, bagua.duì, bagua.qián];
    };


export default
{
    bagua,
    sequence_Gua_OldFamilyOrder,
    sequence_Gua_NewFamilyOrder_ColourComplement_PositionalShift,
    sequence_Gua_NewFamilyOrder_LightSpectrum_TraversalOrder,
    sequence_Gua_NewFamilyOrder_PaintSpectrum_TraversalOrder,
}