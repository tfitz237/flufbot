"use strict"
let irc = require('irc');
class Bot {
    constructor (nick, channels, mainChannel, pass) {
        this.nick = nick;
        this.channels = channels;
        this.mainChannel = mainChannel;
        this.pass = pass;
        connect();
    }

    connect() {
        this.client = new irc.Client('chat.freenode.net', config.nick, { autoRejoin: true, channels: config.channels});
        addListeners();
        setActiveUsers();
        setInterval(setActiveUsers, 60000);
    }
    addListeners() {
        this.client.addListener('registered', function() {
            say('nickserv', 'identify '+this.nick+' '+this.pass);
            this.client.send('nick', this.nick);
        });
        this.client.addListener('message', eventMessage);
        this.client.addListener('join'+this.mainChannel, eventJoin);
        this.client.addListener('part'+this.mainChannel, eventPart);
        this.client.addListener('nick', eventNick);
    }
    updateActiveUsers() {
        var current = new Date();
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].lastActive.getTime() + 900000 <= current.getTime()) {
                this.activeUsers[i].active = false;
            }
        }
        console.log('current active users:');
        console.log(getActiveUsers());
    }

    set activeUser(user) {
        if(user == "pmllbot") return;
        if(this.activeUsers.length == 0) {
            this.activeUsers.push({name: user, lastActive: new Date(), active: true});
        } else {
            var found = false;
            for (var i = 0; i < this.activeUsers.length; i++) {
                if(this.activeUsers[i].name == user) {
                    this.activeUsers[i].lastActive = new Date();
                    this.activeUsers[i].active = true;
                    this.activeUsers[i].pinged = new Date();
                    return;
                }
            }
            this.activeUsers.push({name: user, lastActive: new Date(), active:true, pinged: new Date()});
        }
    }
    set inactiveUser(nick) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(this.activeUsers[i].name == nick) {
                this.activeUsers[i].active = false;
                this.activeUsers[i].pinged = new Date();
            }
        }
    }
    activeUsers(nick) {
        return this.activeUsers
            .filter(user => user.active && user.name != nick)
            .reduce((rtn, user) => rtn + this.activeUsers[i].name + ", ");
    }
    updateNick(oldNick,newNick) {
        for (var i = 0; i < this.activeUsers.length; i++) {
            if(activeUsers[i].name == oldnick) {
                activeUsers[i].name = newnick;
                break;
            }
        }
    }

    eventNick(oldNick, newNick, channels) {
        if(channels.indexOf(this.mainChannel) !== -1) updateNick(oldNick, newNick);
    }
    eventPart(user) {
        this.inactiveUser = user;
    }
    eventJoin(user) {
        this.activeUser = user
    }
    eventMessage(from, to, message) {
        this.activeUser = from;
        checkMesssage(from, to, message);
    }

    contains(cont, stri) {
        stri = stri.toLowerCase();
        if(typeof cont == "string") {
            return stri.indexOf(cont.toLowerCase()) !== -1;
        }
        for(var i = 0; i < cont.length; i++) {
            if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }


}

module.exports = Bot;
