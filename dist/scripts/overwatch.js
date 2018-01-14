'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (bot) {
    return {
        name: 'overwatch',
        commands: ['ow', 'overwatch'],
        isCommand: true,
        private: false,
        async: true,
        rtn: function rtn(from, message) {
            var player = message.replace('#', '-');
            return Promise.all([ow.player(player), ow.playerStats(player)]).then(function (plr) {
                var p = new _player2.default(plr[0], plr[1].stats.competitive.all, plr[1].stats.quickplay.all, plr[1].stats.competitiveRank);
                return p.toEmbed();
            });
        }
    };
};

var _player = require('../models/player');

var _player2 = _interopRequireDefault(_player);

var _oversmash = require('oversmash');

var _oversmash2 = _interopRequireDefault(_oversmash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ow = (0, _oversmash2.default)();
;
//# sourceMappingURL=overwatch.js.map