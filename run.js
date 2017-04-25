var DiscordBot = require('./DiscordBot');
module.exports = new DiscordBot(require('fs').readFileSync('token.txt').toString().trim());
