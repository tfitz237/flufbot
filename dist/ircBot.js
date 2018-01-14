"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var irc = require('irc');
var moment = require('moment');

var Bot = function () {
    function Bot(nick, channels, mainChannel, pass) {
        _classCallCheck(this, Bot);

        this.nick = nick;
        this.channels = channels;
        this.mainChannel = mainChannel;
        this.pass = pass;
        this.activeUsers = [];
        this.connect();
        console.log('Booting up bot...');
        this.commands = require('./scripts')(this).commands;
    }

    _createClass(Bot, [{
        key: 'connect',
        value: function connect() {
            var _this = this;

            this.client = new irc.Client('chat.freenode.net', this.nick, { autoRejoin: true, channels: this.channels, floodProtection: true });
            this.addListeners();
            setInterval(function () {
                return _this.updateActiveUsers();
            }, 60000);
        }
    }, {
        key: 'addListeners',
        value: function addListeners() {
            var _this2 = this;

            this.client.addListener('error', function (message) {
                return console.log(message);
            });
            this.client.addListener('registered', function (message) {
                _this2.client.say('nickserv', 'identify ' + _this2.nick + ' ' + _this2.pass);
                _this2.client.send('nick', _this2.nick);
                console.log('Bot connected');
            });
            this.client.addListener('message', function (from, to, message) {
                return _this2.checkMessage(from, to, message);
            });
            this.client.addListener('join' + this.mainChannel, function (from) {
                return _this2.eventJoin(from);
            });
            this.client.addListener('part' + this.mainChannel, function (from) {
                return _this2.eventPart(from);
            });
            this.client.addListener('nick', function (oldnick, newnick, channels) {
                return _this2.eventNick(oldnick, newnick, channels);
            });
        }
    }, {
        key: 'checkMessage',
        value: function checkMessage(from, to, message) {
            if (from == "pmllbot") return;
            this.activeUser = from;
            var current = new Date();
            if (to == "pmllbot") var sendTo = from;else var sendTo = to;
            this.checkPingedUser(message);
            this.checkCommands(sendTo, from, message);
            this.checkNonCommands(sendTo, from, message);
        }
    }, {
        key: 'checkCommands',
        value: function checkCommands(sendTo, from, message) {
            if (contains(['pmllbot', '~'], message)) {
                var found = false;
                for (var i in this.commands) {
                    if (contains(this.commands[i].commands, message) && this.commands[i].isCommand) {
                        found = true;
                        if (this.commands[i].private) {
                            this.client.say(from, this.commands[i].rtn(from, message));
                        } else {
                            this.client.say(sendTo, this.commands[i].rtn(from, message));
                        }
                        break;
                    }
                }
                if (!found && contains(['pmllbot'], message)) this.client.say(sendTo, 'Yo, ' + from + ', what\'s up?');
            }
        }
    }, {
        key: 'checkNonCommands',
        value: function checkNonCommands(sendTo, from, message) {
            for (var i in this.commands) {
                if (!this.commands[i].isCommand) {
                    if (contains(this.commands[i].commands, message)) {
                        if (this.commands[i].private) {
                            this.client.say(from, this.commands[i].rtn(from, message));
                        } else {
                            this.client.say(sendTo, this.commands[i].rtn(from, message));
                        }
                        break;
                    }
                }
            }
        }
    }, {
        key: 'checkPingedUser',
        value: function checkPingedUser(message) {
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (contains(this.activeUsers[i].name, message)) {
                    if (!this.activeUsers[i].active && typeof this.activeUsers[i].pinged != "undefined") {
                        if (this.activeUsers[i].pinged.getTime() + 100000 <= current.getTime()) {
                            if (this.activeUsers[i].away != false) {
                                this.client.say(sendTo, "away msg: " + this.activeUsers[i].away);
                            }
                            if (this.activeUsers[i].lastActive.getTime() + 600000 <= current.getTime()) {
                                this.client.say(sendTo, this.activeUsers[i].name + ' was last active ' + moment.duration(this.activeUsers[i].lastActive.getTime() - new Date().getTime()).humanize(true));
                                this.activeUsers[i].pinged = current;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }, {
        key: 'updateActiveUsers',
        value: function updateActiveUsers() {
            var current = new Date();
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (this.activeUsers[i].lastActive.getTime() + 900000 <= current.getTime()) {
                    this.activeUsers[i].active = false;
                    this.activeUsers[i].away = false;
                }
            }
            console.log('active: ' + this.getActiveUsers());
        }
    }, {
        key: 'setInactiveUser',
        value: function setInactiveUser(nick) {
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (this.activeUsers[i].name == nick) {
                    this.activeUsers[i].active = false;
                    this.activeUsers[i].pinged = new Date();
                }
            }
        }
    }, {
        key: 'setAway',
        value: function setAway(nick, msg) {
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (this.activeUsers[i].name == nick) {
                    this.activeUsers[i].away = msg;
                    this.activeUsers[i].active = false;
                    this.activeUsers[i].pinged = new Date();
                }
            }
        }
    }, {
        key: 'getActiveUsers',
        value: function getActiveUsers(nick) {
            var rtn = '';
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (this.activeUsers[i].active == true && this.activeUsers[i].name != nick) {
                    rtn += this.activeUsers[i].name;
                    if (this.activeUsers.length - 1 != i) {
                        rtn += ", ";
                    }
                }
            }
            return rtn;
        }
    }, {
        key: 'updateNick',
        value: function updateNick(oldNick, newNick) {
            for (var i = 0; i < this.activeUsers.length; i++) {
                if (this.activeUsers[i].name == oldNick) {
                    this.activeUsers[i].name = newNick;
                    break;
                }
            }
        }
    }, {
        key: 'eventNick',
        value: function eventNick(oldNick, newNick, channels) {
            if (channels.indexOf(this.mainChannel) !== -1) this.updateNick(oldNick, newNick);
        }
    }, {
        key: 'eventPart',
        value: function eventPart(user) {
            console.log(user + " left");
            this.setInactiveUser(user);
        }
    }, {
        key: 'eventJoin',
        value: function eventJoin(user) {
            var active = this.getActiveUsers(user);
            this.activeUser = user;
            if (user != "pmllbot") {
                this.client.say(this.mainChannel, "Hey, " + user + "! Currently the active users are: " + active);
            }
        }
    }, {
        key: 'eventMessage',
        value: function eventMessage(from, to, message) {
            this.activeUser = from;
            this.checkMessage(from, to, message);
        }
    }, {
        key: 'activeUser',
        set: function set(user) {
            var current = new Date();
            if (user == "pmllbot") {
                console.log('Bot joined channel');
                return;
            }
            if (this.activeUsers.length == 0) {
                this.activeUsers.push({ name: user, lastActive: current, active: true, away: false });
            } else {
                for (var i = 0; i < this.activeUsers.length; i++) {
                    if (this.activeUsers[i].name == user) {
                        this.activeUsers[i].lastActive = current;
                        this.activeUsers[i].active = true;
                        this.activeUsers[i].away = false;
                        return;
                    }
                }
                this.activeUsers.push({ name: user, lastActive: current, active: true, away: false });
            }
        }
    }]);

    return Bot;
}();

function contains(cont, stri) {
    stri = stri.toLowerCase();
    if (typeof cont == "string") {
        return stri.indexOf(cont.toLowerCase()) !== -1;
    }
    if (cont[0] == "regex") {
        return stri.search(cont[1]) !== -1;
    }
    for (var i = 0; i < cont.length; i++) {
        if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}

module.exports = Bot;
//# sourceMappingURL=ircBot.js.map