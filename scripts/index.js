module.exports = function(bot) {
    var self = this;
    self.commands = {};
    require('fs').readdirSync(__dirname + '/').forEach(function(file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var name = file.replace('.js', '');
        var tmp = require('./'+file);
        for (prop in tmp) {
            self.commands[prop] = tmp[prop](bot);
        }
      }
    });
    return self;
}
