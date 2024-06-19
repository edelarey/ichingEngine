/**
 * hexagram.js
 * @IExplanation(name = "Hexagram",
description="Enumeration representing the Hexagrams BaGua in Fu Xi Sequence Binary Order i.e. Ascending Binary Value with rightmost digit = LSB (least significant bit)" +
			"When drawing the hexagram, the order of righting to the console forces a reversal in the order the hexagram is rendered. as read from bottom up" +
			"Mapping of binary to king wen sequence: http://www.biroco.com/yijing/sequence.htm")
@IReference(title = "A Companion To Yi Jing Numerology and Cosmology", "https://en.wikibooks.org/wiki/I_Ching/Explanation_Of_I_Ching_Hexagrams_And_Lines"
author= "Nielsen, B",
date= "2003",
publisher = "Element",
page ="3",
description = "Usage: The PRIMARY naming of the hexagrams as enumerations and the placing of hexagrams into palaces."
			+ " - Duplicate Names: When a hexgram name is in common between 2 different Hexagrams, the first occurrence of the Hexgram"
			+ "    in binary terms is CAPITALISED, unless the conflict involves a hexagram named after its two inner trigrams which bear the same name. "
			+ "    in which case it is CAPITALISED as in the case of QIAN (qian, qian)"
			+ " - If a name consists of two words, an underscore separates the words.")
 */
import bagua from '@/const/bagua';

const hexagram = {
    kūn: {
        name: 'kūn',
        symbol: '坤', 
        hexagram: '䷁',
        binary: '000000',
        order: 0, 
        kingwen:2, 
        translation: 'The Receptive',       
        above: bagua.bagua.kūn,
        below: bagua.bagua.kūn,
    },
    bō: {
        name: 'bō',
        symbol: '剝', 
        hexagram: '䷖',
        binary: '100000',
        order: 1, 
        kingwen:23,  
        translation: 'Splitting Apart',         
        above: bagua.bagua.gèn,
        below: bagua.bagua.kūn,
    },
    bǐ: {
        name: 'bǐ',
        symbol: '比', 
        hexagram: '䷇',
        binary: '010000',
        order: 2, 
        kingwen:8,        
        translation: 'Holding Together (Union)',   
        above: bagua.bagua.kǎn,
        below: bagua.bagua.kūn,
    },
    guān: {
        name: 'guān',
        symbol: '觀', 
        hexagram: '䷓',
        binary: '110000',
        order: 3, 
        kingwen:20,        
        translation: 'Contemplation (View)',   
        above: bagua.bagua.xùn,
        below: bagua.bagua.kūn,
    },
    yù: {
        name: 'yù',
        symbol: '豫', 
        hexagram: '䷏',
        binary: '001000',
        order: 4,   
        kingwen:16, 
        translation: 'Enthusiasm',        
        above: bagua.bagua.zhèn,
        below: bagua.bagua.kūn,
    },
    jìn: {
        name: 'jìn',
        symbol: '晉', 
        hexagram: '䷢',
        binary: '101000',
        order: 5, 
        kingwen:35,        
        translation: 'Progress',   
        above: bagua.bagua.lí,
        below: bagua.bagua.kūn,
    },
    cui: {
        name: 'cui',
        symbol: '萃', 
        hexagram: '䷬',
        binary: '011000',
        order: 6,   
        kingwen:45,      
        translation: 'Gathering Together',   
        above: bagua.bagua.duì,
        below: bagua.bagua.kūn,
    },
    pǐ: {
        name: 'pǐ',
        symbol: '否', 
        hexagram: '䷋',
        binary: '111000',
        order: 7,
        kingwen:12,
        translation: 'Standstill (Stagnation)',            
        above: bagua.bagua.qián,
        below: bagua.bagua.kūn,
    },
    qiān: {
        name: 'qiān',
        symbol: '謙', 
        hexagram: '䷎',
        binary: '000100',
        order: 8,   
        kingwen:15,   
        translation: 'Modesty',      
        above: bagua.bagua.kūn,
        below: bagua.bagua.gèn,
    },
    gèn: {
        name: 'gèn',
        symbol: '艮', 
        hexagram: '䷳',
        binary: '100100',
        order: 9,   
        kingwen:52,  
        translation: ' Keeping Still, Mountain',       
        above: bagua.bagua.gèn,
        below: bagua.bagua.gèn,
    },
    jiǎn: {
        name: 'jiǎn',
        symbol: '蹇', 
        hexagram: '䷦',
        binary: '010100',
        order: 10,
        kingwen:39,         
        translation: 'Chien / Obstruction',   
        above: bagua.bagua.kǎn,
        below: bagua.bagua.gèn,
    },
    jiàn: {
        name: 'jiàn',
        symbol: '漸', 
        hexagram: '䷴',
        binary: '110100',
        order: 11, 
        kingwen:53,  
        translation: 'Development (Gradual Progress)',           
        above: bagua.bagua.xùn,
        below: bagua.bagua.gèn,
    },
    xiǎoguò: {
        name: 'xiǎo guò',
        symbol: '小過', 
        hexagram: '䷽',
        binary: '001100',
        order: 12, 
        kingwen:62, 
        translation: 'Preponderance of the Small',         
        above: bagua.bagua.zhèn,
        below: bagua.bagua.gèn,
    },
    lǚ: {
        name: 'lǚ',
        symbol: '旅', 
        hexagram: '䷷',
        binary: '101100',
        order: 13,  
        kingwen:56, 
        translation: 'The Wanderer',         
        above: bagua.bagua.zhèn,
        below: bagua.bagua.gèn,
    },
    xián: {
        name: 'xián',
        symbol: '咸', 
        hexagram: '䷞',
        binary: '011100',
        order: 14, 
        kingwen:31,     
        translation: 'Influence (Wooing)',      
        above: bagua.bagua.duì,
        below: bagua.bagua.gèn,
    },
    dùn: {
        name: 'dùn',
        symbol: '遯', 
        hexagram: '䷠',
        binary: '111100',
        order: 15,
        kingwen:33,    
        translation: 'Retreat',        
        above: bagua.bagua.qián,
        below: bagua.bagua.gèn,
    },
    shī: {
        name: 'shī',
        symbol: '師', 
        hexagram: '䷆',   
        binary: '000010',     
        order: 16, 
        kingwen:7,  
        translation: 'The Army',         
        above: bagua.bagua.kūn,
        below: bagua.bagua.kǎn,
    },
    méng: {
        name: 'méng',
        symbol: '蒙', 
        hexagram: '䷃',
        binary: '100010',
        order: 17,    
        kingwen:4,   
        translation: 'Youthful Folly',     
        above: bagua.bagua.gèn,
        below: bagua.bagua.kǎn,
    },
    kǎn: {
        name: 'kǎn',
        symbol: '坎', 
        hexagram: '䷜',
        binary: '010010',
        order: 18,
        kingwen:29,   
        translation: 'The Abysmal (Water)',         
        above: bagua.bagua.kǎn,
        below: bagua.bagua.kǎn,
    },
    huàn: {
        name: 'huàn',
        symbol: '渙', 
        hexagram: '䷺',
        binary: '110010',
        order: 19,
        kingwen:59,     
        translation: 'Dispersion (Dissolution)',       
        above: bagua.bagua.xùn,
        below: bagua.bagua.kǎn,
    },
    xiè: {
        name: 'xiè',
        symbol: '解', 
        hexagram: '䷧',
        binary: '001010',
        order: 20, 
        kingwen:40,      
        translation: 'Deliverance',     
        above: bagua.bagua.zhèn,
        below: bagua.bagua.kǎn,
    },
    wèijì: {
        name: 'wèi jì',
        symbol: '未濟', 
        hexagram: '䷿',
        binary: '101010',
        order: 21,
        kingwen:64,    
        translation: 'Before Completion',        
        above: bagua.bagua.lí,
        below: bagua.bagua.kǎn,
    },
    kùn: {
        name: 'kùn',
        symbol: '困', 
        hexagram: '䷮',
        binary: '011010',
        order: 22,  
        kingwen:47,       
        translation: 'Oppression (Exhaustion)',   
        above: bagua.bagua.duì,
        below: bagua.bagua.kǎn,
    },
    sòng: {
        name: 'sòng',
        symbol: '訟', 
        hexagram: '䷅',
        binary: '111010',
        order: 23, 
        kingwen:6,   
        translation: 'Conflict',        
        above: bagua.bagua.qián,
        below: bagua.bagua.kǎn,
    },
    shēng: {
        name: 'shēng',
        symbol: '升', 
        hexagram: '䷭',
        binary: '000110',
        order: 24,  
        kingwen:46,  
        translation: 'Pushing Upward',        
        above: bagua.bagua.kūn,
        below: bagua.bagua.xùn,
    },
    gǔ: {
        name: 'gǔ',
        symbol: '蠱', 
        hexagram: '䷑',
        binary: '100110',
        order: 25, 
        kingwen:18,   
        translation: 'Work on What Has Been Spoiled (Decay)',        
        above: bagua.bagua.gèn,
        below: bagua.bagua.xùn,
    },
    jǐng: {
        name: 'jǐng',
        symbol: '井', 
        hexagram: '䷯',
        binary: '010110',
        order: 26, 
        kingwen:48,      
        translation: 'Ching / The Well',     
        above: bagua.bagua.kǎn,
        below: bagua.bagua.xùn,
    },
    xùn: {
        name: 'xùn',
        symbol: '巽', 
        hexagram: '䷸',
        binary: '110110',
        order: 27,    
        kingwen:57,     
        translation: 'The Gentle (Penetrating, Wind)',   
        above: bagua.bagua.xùn,
        below: bagua.bagua.xùn,
    },
    héng: {
        name: 'héng',
        symbol: '恆', 
        hexagram: '䷟',
        binary: '001110',
        order: 28, 
        kingwen:32,      
        translation: 'Duration',     
        above: bagua.bagua.zhèn,
        below: bagua.bagua.xùn,
    },
    dǐng: {
        name: 'dǐng',
        symbol: '鼎', 
        hexagram: '䷱',
        binary: '101110',
        order: 29, 
        kingwen:50,    
        translation: 'The Caldron',       
        above: bagua.bagua.lí,
        below: bagua.bagua.xùn,
    },
    dàguò: {
        name: 'dà guò',
        symbol: '大過', 
        hexagram: '䷛',
        binary: '011110',
        order: 30, 
        kingwen:28,    
        translation: 'Preponderance of the Great',       
        above: bagua.bagua.duì,
        below: bagua.bagua.xùn,
    },
    gòu: {
        name: 'gòu',
        symbol: '姤', 
        hexagram: '䷫',
        binary: '111110',
        order: 31,
        kingwen:44,     
        translation: 'Coming to Meet',       
        above: bagua.bagua.qián,
        below: bagua.bagua.xùn,
    },
    fù: {
        name: 'fù',
        symbol: '復', 
        hexagram: '䷗',
        binary: '000001',
        order: 32,  
        kingwen:24, 
        translation: 'Return (The Turning Point)',              
        above: bagua.bagua.kūn,
        below: bagua.bagua.zhèn,
    },
    yí: {
        name: 'yí',
        symbol: '頤', 
        hexagram: '䷚',
        binary: '100001',
        order: 33,   
        kingwen:27,   
        translation: 'Corners of the Mouth (Nourishment)',        
        above: bagua.bagua.gèn,
        below: bagua.bagua.zhèn,
    },
    zhūn: {
        name: 'zhūn',
        symbol: '屯', 
        hexagram: '䷂',
        binary: '010001',
        order: 34,   
        kingwen:3,  
        translation: 'Difficulty at the Beginning',         
        above: bagua.bagua.kǎn,
        below: bagua.bagua.zhèn,
    },
    yì: {
        name: 'yì',
        symbol: '益', 
        hexagram: '䷩',
        binary: '110001',
        order: 35,   
        kingwen:42,    
        translation: 'Increase',       
        above: bagua.bagua.xùn,
        below: bagua.bagua.zhèn,
    },
    zhèn: {
        name: 'zhèn',
        symbol: '震', 
        hexagram: '䷲',
        binary: '001001',
        order: 36,   
        kingwen:51,  
        translation: 'The Arousing (Shock, Thunder)',         
        above: bagua.bagua.zhèn,
        below: bagua.bagua.zhèn,
    },
    shìkè: {
        name: 'shì kè',
        symbol: '噬嗑', 
        hexagram: '䷔',
        binary: '101001',
        order: 37,   
        kingwen:21,   
        translation: 'Biting Through',        
        above: bagua.bagua.lí,
        below: bagua.bagua.zhèn,
    },
    suí: {
        name: 'suí',
        symbol: '隨', 
        hexagram: '䷐',
        binary: '011001',
        order: 38,   
        kingwen:17,  
        translation: 'Following',         
        above: bagua.bagua.duì,
        below: bagua.bagua.zhèn,
    },
    wúwàng: {
        name: 'wú wàng',
        symbol: '無妄', 
        hexagram: '䷘',
        binary: '111001',
        order: 39,   
        kingwen:25,       
        translation: 'Innocence (The Unexpected)',    
        above: bagua.bagua.qián,
        below: bagua.bagua.zhèn,
    },
    míngyí: {
        name: 'míng yí',
        symbol: '明夷', 
        hexagram: '䷣',
        binary: '000101',
        order: 40,   
        kingwen:36,   
        translation: 'Darkening of the Light',        
        above: bagua.bagua.kūn,
        below: bagua.bagua.lí,
    },
    bì: {
        name: 'bì',
        symbol: '賁', 
        hexagram: '䷕',
        binary: '100101',
        order: 41,   
        kingwen:22,  
        translation: 'Grace',         
        above: bagua.bagua.gèn,
        below: bagua.bagua.lí,
    },
    jìjì: {
        name: 'jì jì',
        symbol: '既濟', 
        hexagram: '䷾',
        binary: '010101',
        order: 42,   
        kingwen:63,  
        translation: 'After Completion',         
        above: bagua.bagua.kǎn,
        below: bagua.bagua.lí,
    },
    jiārén: {
        name: 'jiā rén',
        symbol: '家人', 
        hexagram: '䷤',
        binary: '110101',
        order: 43,   
        kingwen:37,  
        translation: 'The Family (The Clan)',         
        above: bagua.bagua.xùn,
        below: bagua.bagua.lí,
    },
    fēng: {
        name: 'fēng',
        symbol: '豐', 
        hexagram: '䷶',
        binary: '001101',
        order: 44,   
        kingwen:55,  
        translation: 'Abundance',         
        above: bagua.bagua.zhèn,
        below: bagua.bagua.lí,
    },
    lí: {
        name: 'lí',
        symbol: '離', 
        hexagram: '䷝',
        binary: '101101',
        order: 45,   
        kingwen:30,   
        translation: 'The Clinging, Fire',        
        above: bagua.bagua.lí,
        below: bagua.bagua.lí,
    },
    gé: {
        name: 'gé',
        symbol: '革', 
        hexagram: '䷰',
        binary: '011101',
        order: 46,   
        kingwen:49,    
        translation: 'Revolution (Molting)',       
        above: bagua.bagua.duì,
        below: bagua.bagua.lí,
    },
    tóngrén: {
        name: 'tóng rén',
        symbol: '同人', 
        hexagram: '䷌',
        binary: '111101',
        order: 47,   
        kingwen:13,  
        translation: 'Fellowship with Men',         
        above: bagua.bagua.qián,
        below: bagua.bagua.lí,
    },
    lín: {
        name: 'lín',
        symbol: '臨', 
        hexagram: '䷒',
        binary: '000011',
        order: 48,   
        kingwen:19,   
        translation: 'Approach',        
        above: bagua.bagua.kūn,
        below: bagua.bagua.duì,
    },
    sǔn: {
        name: 'sǔn',
        symbol: '損', 
        hexagram: '䷨',
        binary: '100011',
        order: 49,   
        kingwen:41,  
        translation: 'Decrease',         
        above: bagua.bagua.gèn,
        below: bagua.bagua.duì,
    },
    jié: {
        name: 'jié',
        symbol: '節', 
        hexagram: '䷻',
        binary: '010011',
        order: 50,   
        kingwen:60,        
        translation: 'Limitation',   
        above: bagua.bagua.kǎn,
        below: bagua.bagua.duì,
    },
    zhōngfú: {
        name: 'zhōng fú',
        symbol: '中孚', 
        hexagram: '䷼',
        binary: '110011',
        order: 51,   
        kingwen:61,
        translation: 'Inner Truth',           
        above: bagua.bagua.xùn,
        below: bagua.bagua.duì,
    },
    guīmèi: {
        name: 'guī mèi',
        symbol: '歸妹', 
        hexagram: '䷵',
        binary: '001011',
        order: 52,   
        kingwen:54,        
        translation: 'The Marrying Maiden',   
        above: bagua.bagua.zhèn,
        below: bagua.bagua.duì,        
    },
    kuí: {
        name: 'kuí',
        symbol: '睽', 
        hexagram: '䷥',
        binary: '101011',
        order: 53,   
        kingwen:38,        
        translation: 'Opposition',   
        above: bagua.bagua.lí,
        below: bagua.bagua.duì,
    },
    duì: {
        name: 'duì',
        symbol: '兌', 
        hexagram: '䷹',
        binary: '011011',  
        order: 54,   
        kingwen:58,        
        translation: 'The Joyous, Lake',   
        above: bagua.bagua.duì,
        below: bagua.bagua.duì,        
    },
    lu: {
        name: 'lu',
        symbol: '履', 
        hexagram: '䷉',
        binary: '111011', 
        order: 55,   
        kingwen:10,        
        translation: 'Treading (Conduct)',   
        above: bagua.bagua.qián,
        below: bagua.bagua.duì,       
    },
    tài: {
        name: 'tài',
        symbol: '泰', 
        hexagram: '䷊',
        binary: '000111', 
        order: 56,   
        kingwen:11,  
        translation: 'Peace',         
        above: bagua.bagua.kūn,
        below: bagua.bagua.qián,        
    },
    dàchù: {
        name: 'dà chù',
        symbol: '大畜', 
        hexagram: '䷙',
        binary: '100111', 
        order: 57,   
        kingwen:26,   
        translation: 'The Taming Power of the Great',        
        above: bagua.bagua.gèn,
        below: bagua.bagua.qián,        
    },
    xū: {
        name: 'xū',
        symbol: '需', 
        hexagram: '䷄',
        binary: '010111', 
        order: 58,   
        kingwen:5,
        translation: 'Waiting (Nourishment)',           
        above: bagua.bagua.kǎn,
        below: bagua.bagua.qián,        
    },
    xiǎochù: {
        name: 'xiǎo chù',
        symbol: '小畜', 
        hexagram: '䷈',
        binary: '110111', 
        order: 59,   
        kingwen:9,  
        translation: 'The Taming Power of the Small',         
        above: bagua.bagua.xùn,
        below: bagua.bagua.qián,        
    },
    dàzhuàng: {
        name: 'dà zhuàng',
        symbol: '大壯', 
        hexagram: '䷡',
        binary: '001111', 
        order: 60,   
        kingwen:34,   
        translation: 'The Power of the Great',        
        above: bagua.bagua.zhèn,
        below: bagua.bagua.qián,        
    },
    dàyǒu: {
        name: 'dà yǒu',
        symbol: '大有', 
        hexagram: '䷍',
        binary: '101111', 
        order: 61,   
        kingwen:14,    
        translation: 'Possession in Great Measure',       
        above: bagua.bagua.lí,
        below: bagua.bagua.qián,        
    },
    guài: {
        name: 'guài',
        symbol: '夬', 
        hexagram: '䷪',
        binary: '011111',
        order: 62,   
        kingwen:43,      
        translation: 'Break-through (Resoluteness)',     
        above: bagua.bagua.duì,
        below: bagua.bagua.qián,      
    },
    qián: {
        name: 'qián',
        symbol: '乾', 
        hexagram: '䷀',
        binary: '111111',
        order: 63,   
        kingwen:1,    
        translation: 'The Creative, Heaven',       
        above: bagua.bagua.qián,
        below: bagua.bagua.qián,
        explanation: `The first hexagram is made up of six unbroken lines. These unbroken lines stand for the primal power, which is light-giving, active, strong, and of the spirit. The hexagram is consistently strong in character, and since it is without weakness, its essence is power or energy. Its image is heaven. Its energy is represented as unrestricted by any fixed conditions in space and is therefore conceived of as motion. Time is regarded as the basis of this motion. Thus the hexagram includes also the power of time and the power of persisting in time, that is, duration. The power represented by the hexagram is to be interpreted in a dual sense in terms of its action on the universe and of its action on the world of men. In relation to the universe, the hexagram expresses the strong, creative action of the Deity. In relation to the human world, it denotes the creative action of the holy man or sage, of the ruler or leader of men, who through his power awakens and develops their higher nature.`,
        judgement:  `The Creative works sublime success, Furthering through perseverance.According to the original meaning, the attributes [sublimity, potentiality of success, power to further, perseverance] are paired. When an individual draws this oracle, it means that success will come to him from the primal depths of the universe and that everything depends upon his seeking his happiness and that of others in one way only, that is, by perseverance in what is right. The specific meanings of the four attributes became the subject of speculation at an early date. The Chinese word here rendered by 'sublime' means literally 'head,' 'origin,' 'great.' This is why Confucius says in explaining it: 'Great indeed is the generating power of the Creative; all beings owe their beginning to it. This power permeates all heaven.' For this attribute inheres in the other three as well. The beginning of all things lies still in the beyond in the form of ideas that have yet to become real. But the Creative furthermore has power to lend form to these archetypes of ideas. This is indicated in the word success, and the process is represented by an image from nature: The clouds pass and the rain does its work, and all individual beings flow into their forms. Applies to the human world, these attributes show the great man the way to notable success: Because he sees with great clarity and cause and effects, he completes the six steps at the right time and mounts toward heaven on them at the right time, as though on six dragons. The six steps are the six different positions given in the hexagram, which are represented later by the dragon symbol. Here it is shown that the way to success lies in apprehending and giving actuality to the way of the universe [Tao], which, as a law running through end and beginning, brings about all phenomena in time. Thus each step attained forthwith becomes a preparation for the next. Time is no longer a hindrance but the means of making actual what is potential. The act of creation having found expression in the two attributes sublimity and success, the work of conservation is shown to be a continuous actualization and differentiation of form. This is expressed in the two terms 'furthering' (literally, 'creating that which accords with the nature of a given being') and 'persevering' (literally, 'correct and firm'). 'The course of the Creative alters and shapes beings until each attains its true, specific nature, then it keeps them in conformity with the Great Harmony. Thus does it show itself to further through perseverance.' In relation to the human sphere, this shows how the great man brings peace and security to the world through his activity in creating order: 'He towers high above the multitude of beings, and all lands are united in peace.' Another line of speculation goes still further in separating the words 'sublime,' 'success,' 'furthering,' 'perseverance,' and parallels them with the four cardinal virtues in humanity. To sublimity, which, as the fundamental principle, embraces all the other attributes, it links love. To the attribute success are linked the morals, which regulate and organize expressions of love and thereby make them successful. The attribute furthering is correlated with justice, which creates the conditions in which each receives that which accords with his being, that which is due him and which constitutes his happiness. The attribute perseverance is correlated with wisdom, which discerns the immutable laws of all that happens and can therefore bring about enduring conditions. These speculations, already broached in the commentary called Wên Yen , later formed the bridge connecting the philosophy of the five stages (elements) of change, as laid down in the Book of History (Shu Ching) with the philosophy of the Book of Changes, which is based solely on the polarity of positive and negative principles. In the course of time this combination of the two systems of thought opened the way for an increasingly intricate number symbolism.`,
        image:`The movement of heaven is full of power.Thus the superior man makes himself strong and untiring. Since there is only one heaven, the doubling of the trigram Ch'ien, of which heaven is the image, indicates the movement of heaven. One complete revolution of heaven makes a day, and the repetition of the trigram means that each day is followed by another. This creates the idea of time. Since it is the same heaven moving with untiring power, there is also created the idea of duration both in and beyond time, a movement that never stops nor slackens, just as one day follows another in an unending course. This duration in time is the image of the power inherent in the Creative. With this image as a model, the sage learns how best to develop himself so that his influence may endure. He must make himself strong in every way, by consciously casting out all that is inferior and degrading. Thus he attains that tirelessness which depends upon consciously limiting the fields of his activity.`,
        lines:`Nine in the second place means: 

        Dragon appearing in the field.
        It furthers one to see the great man.
        
        Here the effects of the light-giving power begin to manifest themselves. In terms of human affairs, this means that the great man makes his appearance in his chosen field of activity. As yet he has no commanding position but is still with his peers. However, what distinguishes him form the others is his seriousness of purpose, his unqualified reliability, and the influence he exerts on his environment with out conscious effort. Such a man is destined to gain great influence and to set the world in order. Therefore it is favorable to see him.
        
        Nine in the third place means:
        
        All day long the superior man is creatively active.
        At nightfall his mind is still beset with cares.
        Danger. No blame.
        
        A sphere of influence opens up for the great man. His fame begins to spread. The masses flock to him. His inner power is adequate to the increased outer activity. There are all sorts of things to be done, and when others are at rest in the evening, plans and anxieties press in upon him. But danger lurks here at the place of transition from lowliness to the heights. Many a great man has been ruined because the masses flocked to him and swept him into their course. Ambition has destroyed his integrity. However, true greatness is not impaired by temptations. He who remains in touch with the time that is dawning, and with its demands is prudent enough to avoid all pitfalls, and remains blameless.
        
        Nine in the fourth place means:
        
        Wavering flight over the depths.
        No blame.
        
        A place of transition has been reached, and free choice can enter in. A twofold possibility is presented to the great man: he can soar to the heights and play an important part in the world, or he can withdraw into solitude and develop himself. He can go the way of the hero or that of the holy sage who seeks seclusion. There is no general law of his being. If the individual acts consistently and is true to himself, he will find the way that is appropriate for him. This way is right for him and without blame.
        
        Nine in the fifth place means:
        
        Flying dragon in the heavens.
        It furthers one to see the great man.
        
        Here the great man has attained the sphere of the heavenly beings. His influence spreads and becomes visible throughout the whole world. Everyone who sees him may count himself blessed. Confucius says about this line:
        
        Things that accord in tone vibrate together. Things that have affinity in their inmost natures seek one another. Water flows to what is wet, fire turns to what is dry. Clouds (the breath of heaven) follow the dragon, wind (the breath of earth) follows the tiger. Thus the sage arises, and all creatures follow him with their eyes. What is born of heaven feels related to what is above. What is born of earth feels related to what is below. Each follows its kind.
        
        Nine at the top means:
        
        Arrogant dragon will have cause to repent.
        
        When a man seeks to climb so high that he loses touch with the rest of mankind, he becomes isolated, and this necessarily leads to failure. This line warns against titanic aspirations that exceed one's power. A precipitous fall would follow.
        When all the lines are nines, it means:
        
        There appears a flight of dragons without heads.
        Good fortune.
        
        When all the lines are nines, it means that the whole hexagram is in motion and changes into the hexagram K'un, THE RECEPTIVE, whose character is devotion. The strength of the Creative and the mildness of the Receptive unite. Strength is indicated by the flight of dragons, mildness by the fact that their heads are hidden. This means that mildness in action joined to strength of decision brings good fortune.`
    },
}

const seq_GreyCode = [
    2,24,19,7,46,11,36,15,
    62,55,34,32,40,54,51,16,
    45,17,58,47,28,43,49,31,
    39,63,5,48,29,60,3,8,
    20,42,61,59,57,9,37,53,
    33,13,1,44,6,10,25,12,
    35,21,38,64,50,14,30,56,
    52,22,26,18,4,41,27,23
    ];

function getHexagramByBinary(binary)
{
    let hexagram = this.sequence_binary().filter((item) => item.binary == binary);
    if (hexagram.length > 0)
    {
        return this.sequence_binary().filter((item) => item.binary == binary)[0];
    }
    else return this.hexagram.kūn;
   
}
 function sequence_kingwen()
 {
    return _.sortBy(hexagram, ['kingwen'],['asc']);
 }

 function sequence_binary()
 {
    return _.sortBy(hexagram, ['order'],['asc']);
 }
 function sequence_greycode()
 {
    let start = sequence_kingwen();
    let sequence_GreyCode = [];

    for (let i = 0; i <= start.length-1; i++)
    {     
        sequence_GreyCode.push(start[seq_GreyCode[i]-1]);
    }
    
    return sequence_GreyCode;
 }



export default
{
    hexagram,
    getHexagramByBinary,
    sequence_binary,
    sequence_kingwen,
    sequence_greycode,

}