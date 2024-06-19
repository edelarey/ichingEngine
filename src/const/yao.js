const Color = require("color");

    const yao = {
        changingyang: {
            alternate: "OLDYANG",
            line: "-0-",
            binaryString: "1",
            polarityString: "+ve -> -ve",
            coinValue: 9,
            color: Color.rgb(255,165,0),
            translation: "OLDYANG",
            changing: true,
        },
        changingyin: {
            alternate: "OLDYIN",
            line: "-X-",
            binaryString: "0",
            polarityString: "-ve -> +ve",
            coinValue: 6,
            color: Color.rgb(0,0,255),
            translation: "OLDYIN",
            changing: true,
        },
        yang: {
            alternate: "YOUNGYANG",
            line:"---",
            binaryString:"1",
            polarityString: "+ve",
            coinValue: 7,
            color: Color.rgb(255,255,0),
            translation: "LIGHT;SUN",
            changing:  false
        },
        yin: {
            alternate: "YOUNGYIN",
            line: "- -",
            binaryString: "0",
            polarityString: "-ve",
            coinValue: 8,
            color: Color.rgb(0,0,0),
            translation: "SHADE,MOON",
            changing:  false,
        },
    };        
    
    // write a function to toss a coin 3 times , head is worth 3, tail is worth 2, then based on the value of the coin toss, return a yao
    function tossCoin() {
        let coinToss = 0;
        for (let i = 0; i < 3; i++) {
            coinToss += Math.floor(Math.random() * 2) + 2;
        }
        if (coinToss === 6) {
            return yao.changingyin;
        } else if (coinToss === 9) {
            return yao.changingyang;
        } else if (coinToss === 7) {
            return yao.yang;
        } else if (coinToss === 8) {
            return yao.yin;
        }
    };

    // write a function to toss 6 coins, and return an array of 6 yao
    function tossYarrowStalks() {
        let yarrowStalks = [];
        for (let i = 0; i < 6; i++) {
            yarrowStalks.push(tossCoin());
        }
        return yarrowStalks;
    };

export default{
    yao,
    tossCoin,
    tossYarrowStalks,    
}
























