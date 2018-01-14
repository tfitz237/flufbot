'use strict';

exports.nyan = function (bot) {
    return {
        name: 'nyancat',
        commands: ['nyancat', 'nyan', 'rainbowcat'],
        rtn: function rtn() {
            return 'http://i.imgur.com/TohPiyP.gif';
        },
        isCommand: true,
        private: false
    };
};
//# sourceMappingURL=random.js.map