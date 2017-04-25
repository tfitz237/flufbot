
exports.rollDice =  function(bot) {
    return {
        name: 'roll a die',
        commands: ["roll me a die", "dice", "roll it", "1d6", "roll a die"],
        rtn: (from, message) => {
            let match = /([0-9])d([0-9]+)/.exec(message);
            let num = match[1] || 1;
            let sides = match[2] || 6;
            let rolls = '';
            for(let i = 0; i < num; i++) {
                let result = Math.floor((Math.random() * sides) + 1);
                rolls += result +" "+ emoji(result)+", ";
            }
            return '__Rolling '+num+'d'+sides+'__ '+rolls;
        },
        isCommand: true,
        private: false
    };
};


function emoji(result) {
    return ':dice'+result+':';


}