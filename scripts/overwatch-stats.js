import Player from '../models/player';
import oversmash from 'oversmash';
let ow = oversmash();
export default function (bot) {
    return {
        name: 'overwatch',
        commands: ['owstats', 'overwatch'],
        isCommand: true,
        private: false,
        async: true,
        rtn: (from, message) => {
            let player = message.replace('#','-');
            return Promise.all([ow.player(player),ow.playerStats(player)]).then(plr => {
                let p = new Player(plr[0], plr[1].stats.competitive.all, plr[1].stats.quickplay.all, plr[1].stats.competitiveRank);
                return p.toEmbed();
            });
        }
}


};