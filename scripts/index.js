export default function(bot) {
    const commands = {};
    require('fs').readdirSync(__dirname + '/').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        let name = file.replace('.js', '');
        let tmp = require('./'+file);
        for (let prop in tmp) {
            commands[prop] = tmp[prop](bot);
        }
      }
    });
    return commands;
}
