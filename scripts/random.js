
exports.smoq = function(bot) {
    return {
        name: 'smoq call',
        commands: ['smoq', 'smoak', 'smoake', 'blazeit'],
        rtn: (from) => 'Yo @here,' + from + ' says blaze it.',
        isCommand: false,
        private: false
    }
}

exports.fuckyou = function(bot) {
    return {
        name: 'fuckyoutoo',
        commands: ['fuck you','fuck off','you suck','damn you','motherfucker','fucker'],
        rtn: (from) => 'Well fuck you too, ' + from,
        isCommand: true,
        private: false
    }
}