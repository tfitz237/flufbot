'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _scripts = require('./scripts');

var _scripts2 = _interopRequireDefault(_scripts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bot = function () {
    function Bot(token) {
        _classCallCheck(this, Bot);

        console.log('Booting up bot...');
        this.commands = (0, _scripts2.default)(this);
        this.connect(token);
    }

    _createClass(Bot, [{
        key: 'connect',
        value: function connect(token) {
            this.client = new _discord2.default.Client({ autoReconnect: true });
            this.client.login(token).then(function (msg) {
                return console.log('Logged in.');
            }).catch(function (msg) {
                return console.log('error', msg);
            });
            this.addListeners();
            this.users = {};
        }
    }, {
        key: 'addListeners',
        value: function addListeners() {
            var _this = this;

            this.client.on('error', function (message) {
                return console.log(message);
            });
            this.client.on('ready', function () {
                //this.commands.playYoutube.connectAudio(this);
                console.log('Bot connected');
            });
            this.client.on('message', function (message) {
                return _this.checkMessage(message);
            });
        }
    }, {
        key: 'checkMessage',
        value: function checkMessage(message) {
            if (message.author.username === "flufbot") return;
            this.updateUser(message.author, message);
            var found = this.checkCommands(message);
            if (!found) this.checkNonCommands(message);
        }
    }, {
        key: 'checkCommands',
        value: function checkCommands(msg) {
            var from = msg.author.username;
            var message = msg.content;
            var prefix = false;
            if (message.substring(0, 1) === "!") {
                prefix = "!";
            }
            if (msg.mentions.users.exists('username', 'flufbot')) {
                prefix = this.id + ' ';
            }
            if (prefix) {
                var found = false;
                for (var i in this.commands) {
                    if (this.commands[i].isCommand && this.containsCommand(this.commands[i].commands, message, prefix)) {
                        found = true;
                        message = this.removeCommands(this.commands[i].commands, message, prefix);
                        if (this.commands[i].private) {
                            var channel = msg.author.dmChannel;
                            if (channel) {
                                if (this.commands[i].async) {
                                    this.commands[i].rtn(from, message, msg).then(function (val) {
                                        msg.author.dmChannel.sendMessage(val);
                                    });
                                } else {
                                    msg.author.dmChannel.sendMessage(this.commands[i].rtn(from, message, msg));
                                }
                            } else {
                                msg.channel.sendMessage('Sorry, I had trouble DMing you...');
                            }
                            return true;
                        } else {
                            if (this.commands[i].async) {
                                this.commands[i].rtn(from, message, msg).then(function (val) {
                                    msg.channel.sendMessage(val);
                                });
                            } else {
                                msg.channel.sendMessage(this.commands[i].rtn(from, message, msg));
                            }
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }, {
        key: 'checkNonCommands',
        value: function checkNonCommands(msg) {
            var from = msg.author.username;
            var message = msg.content;
            for (var i in this.commands) {
                if (!this.commands[i].isCommand) {
                    if (contains(this.commands[i].commands, message)) {
                        message = this.removeCommands(this.commands[i], message);
                        if (this.commands[i].private) {
                            msg.author.dmChannel.sendMessage(this.commands[i].rtn(from, message));
                        } else {
                            msg.channel.sendMessage(this.commands[i].rtn(from, message));
                        }
                        break;
                    }
                }
            }
        }
    }, {
        key: 'containsCommand',
        value: function containsCommand(commands, message, prefix) {
            message = message.toLowerCase();
            for (var i = 0; i < commands.length; i++) {
                var command = commands[i].toLowerCase();
                var test = message.substring(prefix.length, prefix.length + commands[i].length);
                if (command === test) {
                    return true;
                }
            }
        }
    }, {
        key: 'getSubCommand',
        value: function getSubCommand(message, layer) {
            layer = layer - 1 || 0;
            message = message.toLowerCase();
            var subcommand = message.split(' ');
            if (subcommand.length > layer) {
                return subcommand[layer];
            }
            return false;
        }
    }, {
        key: 'removeCommands',
        value: function removeCommands(commands, message, prefix) {
            prefix = prefix || '';
            var message2 = message.toLowerCase();
            for (var i = 0; i < commands.length; i++) {
                var command = commands[i].toLowerCase();
                var test = message2.substring(prefix.length, prefix.length + commands[i].length);
                if (command === test) {
                    message = message.replace(prefix + command, '');
                    break;
                }
            }
            message = message.trim();
            return message;
        }
    }, {
        key: 'updateUser',
        value: function updateUser(user, message) {
            user.lastMessage = message;
            this.users[user.id] = user;
        }
    }, {
        key: 'id',
        get: function get() {
            return '<@' + this.client.user.id + '>';
        }
    }]);

    return Bot;
}();

function contains(cont, stri) {
    stri = stri.toLowerCase();
    if (!cont) {
        return false;
    }
    if (typeof cont === "string") {
        return stri.indexOf(cont.toLowerCase()) !== -1;
    }
    if (cont[0] === "regex") {
        return stri.search(cont[1]) !== -1;
    }
    for (var i = 0; i < cont.length; i++) {
        if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}

exports.default = Bot;
//# sourceMappingURL=Bot.js.map