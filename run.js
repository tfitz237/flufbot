var Bot = require('./Bot');
module.exports = new Bot(require('fs').readFileSync('token.txt').toString().trim());
