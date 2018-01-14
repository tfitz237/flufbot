"use strict";

exports.rollDice = function (bot) {
    return {
        name: 'roll a die',
        commands: ["roll me a die", "dice", "roll it", "1d6", "roll a die"],
        rtn: function rtn(from, message) {
            var match = /([0-9])d([0-9]+)/.exec(message);
            var num = match[1] || 1;
            var sides = match[2] || 6;
            var rolls = '';
            for (var i = 0; i < num; i++) {
                var result = Math.floor(Math.random() * sides + 1);
                rolls += result + " " + emoji(result) + ", ";
            }
            return '__Rolling ' + num + 'd' + sides + '__ ' + rolls;
        },
        isCommand: true,
        private: false
    };
};

function emoji(result) {
    return ':dice' + result + ':';
}
//# sourceMappingURL=dice.js.map