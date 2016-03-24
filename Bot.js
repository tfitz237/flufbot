"use strict"
let irc = require('irc');
var moment = require('moment');
class Bot {
    constructor (nick, channels, mainChannel, pass) {
        this.nick = nick;
        this.channels = channels;
        this.mainChannel = mainChannel;
        this.pass = pass;
        this.activeUsers = [];
        this.connect();
        console.log('Booting up bot...');
        this.commands = require('./scripts')(this).commands;
    }
    connect() {
        this.client = new irc.Client('chat.freenode.net', this.nick, { autoRejoin: true, channels: this.channels, floodProtection:true});
        this.addListeners();
        setInterval(() => this.updateActiveUsers(), 60000);
    }
    addListeners() {
        this.client.addListener('error', message => console.log(message));
        this.client.addListener('registered',(message)  => {
            this.client.say('nickserv', 'identify '+this.nick+' '+this.pass);
            this.client.send('nick', this.nick);
            console.log('Bot connected');
        });
        this.client.addListener('message', (from, to, message) => this.checkMessage(from, to, message));
        this.client.addListener('join'+this.mainChannel, (from) => this.eventJoin(from));
        this.client.addListener('part'+this.mainChannel, (from) => this.eventPart(from));
        this.client.addListener('nick', (oldnick, newnick, channels) => this.eventNick(oldnick, newnick, channels));

    }
    checkMessage(from, to, message) {
        if(from == "pmllbot") return;
        this.activeUser = from;
        var current = new Date();
        if(to == "pmllbot") var sendTo = from; else var sendTo = to;
        checkPingedUser(message);
        checkCommands(sendTo, from, message);
        checkNonCommands(sendTo, from, message);
    }
    checkCommands(sendTo, from, message) {
        if (contains(['pmllbot','~'], message)) {
            var found = false;
            for(var i in this.commands) {
                if(contains(this.commands[i].commands, message) && this.commands[i].isCommand) {
                    found = true;
                    if(this.commands[i].private) {
                        this.client.say(from, this.commands[i].rtn(from,message));
                    } else {
                        this.client.say(sendTo, this.commands[i].rtn(from,message));
                    }
                    break;
                }
            }
            if(!found && contains(['pmllbot'], message)) this.client.say(sendTo, 'Yo, ' + from + ', what\'s up?');
        }
    }
    checkNonCommands(sendTo, from, message) {
        for (var i in this.commands) {
            if(!this.commands[i].isCommand) {
                if(contains(this.commands[i].commands, message)) {
                    if(this.commands[i].private) {
                        this.client.say(from, this.commands[i].rtn(from,message));
                    } else {
                        this.client.say(sendTo, this.commands[i].rtn(from,message));
                    }
                    break;
                }
            }
        }
    }
    checkPingedUser(message) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(contains(this.activeUsers[i].name,message)) {
                if(!this.activeUsers[i].active && typeof this.activeUsers[i].pinged != "undefined") {
                    if(this.activeUsers[i].pinged.getTime() + 100000 <= current.getTime()) {
                        if(this.activeUsers[i].away != false) {
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
    updateActiveUsers() {
        var current = new Date();
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].lastActive.getTime() + 900000 <= current.getTime()) {
                this.activeUsers[i].active = false;
                this.activeUsers[i].away = false;
            }
        }
        console.log('active: '+this.getActiveUsers());
    }
    set activeUser(user) {
        var current = new Date();
        if(user == "pmllbot") {
            console.log('Bot joined channel');
            return;
        }
        if(this.activeUsers.length == 0) {
            this.activeUsers.push({name: user, lastActive: current, active: true, away: false});
        } else {
            for (var i = 0; i < this.activeUsers.length; i++) {
                if(this.activeUsers[i].name == user) {
                    this.activeUsers[i].lastActive = current;
                    this.activeUsers[i].active = true;
                    this.activeUsers[i].away = false;
                    return;
                }
            }
            this.activeUsers.push({name: user, lastActive: current, active:true, away: false});
        }
    }
    setInactiveUser(nick) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].name == nick) {
                this.activeUsers[i].active = false;
                this.activeUsers[i].pinged = new Date();
            }
        }
    }
    setAway(nick, msg) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].name == nick) {
                this.activeUsers[i].away = msg;
                this.activeUsers[i].active = false;
                this.activeUsers[i].pinged = new Date();
            }
        }
    }
    getActiveUsers(nick) {
        var rtn = '';
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].active == true && this.activeUsers[i].name != nick) {
                rtn += this.activeUsers[i].name;
                if(this.activeUsers.length - 1  != i) {
                    rtn += ", ";
                }
            }
        }
        return rtn;
    }
    updateNick(oldNick,newNick) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].name == oldNick) {
                this.activeUsers[i].name = newNick;
                break;
            }
        }
    }

    eventNick(oldNick, newNick, channels) {
        if(channels.indexOf(this.mainChannel) !== -1) this.updateNick(oldNick, newNick);
    }
    eventPart(user) {
        console.log(user + " left");
        this.setInactiveUser(user);
    }
    eventJoin(user) {
        var active = this.getActiveUsers(user);
        this.activeUser = user;
        if(user != "pmllbot") {
            this.client.say(this.mainChannel, "Hey, " + user + "! Currently the active users are: " + active);
        }
    }
    eventMessage(from, to, message) {
        this.activeUser = from;
        this.checkMessage(from, to, message);
    }


}

function contains(cont, stri) {
        stri = stri.toLowerCase();
        if(typeof cont == "string") {
            return stri.indexOf(cont.toLowerCase()) !== -1;
        }
        if(cont[0] == "regex") {
            return stri.search(cont[1]) !== -1;
        }
        for(var i = 0; i < cont.length; i++) {
            if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }

module.exports = Bot;
