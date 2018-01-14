'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (bot) {
  var commands = {};
  require('fs').readdirSync(__dirname + '/').forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
      var name = file.replace('.js', '');
      var tmp = require('./' + file);
      for (var prop in tmp) {
        commands[prop] = tmp[prop](bot);
      }
    }
  });
  return commands;
};
//# sourceMappingURL=index.js.map