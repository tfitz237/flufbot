
exports.rollDice =  function(bot) {
    return {
        name: 'roll a die',
        commands: ["roll me a die", "dice", "roll it", "1d6", "roll a die"],
        rtn: () => 'Rolling a 1d6 gave me: ' + Math.floor((Math.random() * 6) + 1),
        isCommand: true,
        private: false
    };
}
exports.smoq =  function(bot) {
    return {
        name: 'smoq',
        commands: [ "smoq", "smoak", "smock", "ne14atoke", "neversmokealone"],
        rtn: (from) => from + " wants to smoke! who will smoke with him?! " + bot.getActiveUsers(from),
        isCommand: false,
        private: false
    };
}
exports.fuckyoutoo = function(bot) {
    return {
        name: 'fuckyoutoo',
        commands: ["fuck you "],
        rtn: function(from) { return "Well fuck you too, " + from},
        isCommand: true,
        private: false
    };
}
