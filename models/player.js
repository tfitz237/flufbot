import Discord from 'discord.js';
export default class Player {

    constructor(player, competitiveGameStats, quickPlayGameStats, rank) {
        this.player = {};
        this.competitive = {};
        this.quickPlay = {};
        this.constructPlayer(this.player, player);
        this.constructStats(this.competitive, competitiveGameStats, rank);
        this.constructStats(this.quickPlay, quickPlayGameStats);
    }

    constructPlayer(obj, player) {
        obj.urlName = player.name;
        obj.name = player.accounts[0].displayName;
        obj.level = player.accounts[0].level;
        obj.portrait = player.accounts[0].portrait;
    }

    constructStats(obj, stats, rank) {
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

    determineSkillRating(type) {
        const goodHealing = type.stats.best.healing / 10000;
        const goodElims = type.stats.best.eliminations / 20;
        const goodStreak = type.stats.best.streak / 20;
        const kda = type.stats.kda;
        const ratio = type.stats.ratio || 0;

        const rating = Math.round((goodHealing + goodElims + goodStreak + ratio));

        return rating;
    }

    toEmbed() {
        const embed = new Discord.RichEmbed()
            .setAuthor(this.player.name, this.player.portrait)
            .setURL('https://www.overbuff.com/players/pc/' + this.player.urlName)
            .setThumbnail(this.player.portrait)
            .addField('Competitive', this.generateStats(this.competitive))
            .addField('QuickPlay', this.generateStats(this.quickPlay));
        return {embed};
    }

    generateStats(obj) {
        return        `
                       Rating: ${obj.rating}
                       Competitive Rank: ${obj.stats.rank}
                       Match Ratio: ${obj.games.ratio}
                       KDA: ${obj.stats.kda}
                       Best Streak: ${obj.stats.best.streak}
                       Most Eliminations: ${obj.stats.best.eliminations}
                       Most Healing: ${obj.stats.best.healing}
                       `;
    }
}