'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(player, competitiveGameStats, quickPlayGameStats, rank) {
        _classCallCheck(this, Player);

        this.player = {};
        this.competitive = {};
        this.quickPlay = {};
        this.constructPlayer(this.player, player);
        this.constructStats(this.competitive, competitiveGameStats, rank);
        this.constructStats(this.quickPlay, quickPlayGameStats);
    }

    _createClass(Player, [{
        key: 'constructPlayer',
        value: function constructPlayer(obj, player) {
            obj.urlName = player.name;
            obj.name = player.accounts[0].displayName;
            obj.level = player.accounts[0].level;
            obj.portrait = player.accounts[0].portrait;
        }
    }, {
        key: 'constructStats',
        value: function constructStats(obj, stats, rank) {
            obj.games = stats.game;

            obj.games.ratio = Math.round(obj.games.games_won / obj.games.games_lost * 100) / 100 || 'N/A';
            obj.stats = {};
            obj.stats.rank = rank || 'N/A';
            obj.stats.kda = Math.round(stats.combat.eliminations / stats.combat.deaths * 100) / 100;
            obj.stats.best = {};
            obj.stats.best.streak = stats.best.kill_streak_best;
            obj.stats.best.eliminations = stats.best.eliminations_most_in_game;
            obj.stats.best.healing = stats.best.healing_done_most_in_game;

            obj.rating = this.determineSkillRating(obj);
        }
    }, {
        key: 'determineSkillRating',
        value: function determineSkillRating(type) {
            var goodHealing = type.stats.best.healing / 10000;
            var goodElims = type.stats.best.eliminations / 20;
            var goodStreak = type.stats.best.streak / 20;
            var kda = type.stats.kda;
            var ratio = type.stats.ratio || 0;

            var rating = Math.round(goodHealing + goodElims + goodStreak + ratio);

            return rating;
        }
    }, {
        key: 'toEmbed',
        value: function toEmbed() {
            var embed = new _discord2.default.RichEmbed().setAuthor(this.player.name, this.player.portrait).setURL('https://www.overbuff.com/players/pc/' + this.player.urlName).setThumbnail(this.player.portrait).addField('Competitive', this.generateStats(this.competitive)).addField('QuickPlay', this.generateStats(this.quickPlay));
            return { embed: embed };
        }
    }, {
        key: 'generateStats',
        value: function generateStats(obj) {
            return '\n                       Rating: ' + obj.rating + '\n                       Competitive Rank: ' + obj.stats.rank + '\n                       Match Ratio: ' + obj.games.ratio + '\n                       KDA: ' + obj.stats.kda + '\n                       Best Streak: ' + obj.stats.best.streak + '\n                       Most Eliminations: ' + obj.stats.best.eliminations + '\n                       Most Healing: ' + obj.stats.best.healing + '\n                       ';
        }
    }]);

    return Player;
}();

exports.default = Player;
//# sourceMappingURL=player.js.map