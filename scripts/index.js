module.exports = function(bot) {
    let self = this;
    self.commands = {};
    require('fs').readdirSync(__dirname + '/').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        let name = file.replace('.js', '');
        let tmp = require('./'+file);
        for (let prop in tmp) {
            self.commands[prop] = tmp[prop](bot);
        }
      }
    });
    return self;
}
