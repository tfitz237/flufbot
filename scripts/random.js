
exports.rollDice =  function(bot) {
    return {
        name: 'roll a die',
        commands: ["roll me a die", "dice", "roll it", "1d6", "roll a die"],
        rtn: () => 'Rolling a 1d6 gave me: ' + Math.floor((Math.random() * 6) + 1),
        isCommand: true,
        private: false
    };
}
