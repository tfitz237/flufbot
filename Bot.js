let Discord = require('discord.js');

class Bot {
    constructor (token) {
        console.log('Booting up bot...');
        this.commands = require('./scripts')(this).commands;
        this.connect(token);
    }
    connect(token) {
        this.client = new Discord.Client({autoReconnect: true});
        this.client.login(token)
			.then((msg) => console.log('Logged in.'))
			.catch((msg) => console.log('error', msg));
	    this.addListeners();
	    this.users = {};
    }
    addListeners() {
        this.client.on('error', message => console.log(message));
        this.client.on('ready',()  => {
            this.commands.playYoutube.connectAudio(this);
            console.log('Bot connected');
        });
        this.client.on('message', message => this.checkMessage(message));
    }
    checkMessage(message) {
        if(message.author.username === "pmll-bot") return;
        this.updateUser(message.author, message);
        let found = this.checkCommands(message);
        if (!found) this.checkNonCommands(message);
    }
    checkCommands(msg) {
        let from = msg.author.username;
        let message = msg.content;
        let prefix = false;
        if(message.substring(0,1) === "!") {
            prefix = "!";
        }
        if (msg.mentions.users.exists('username', 'pmll-bot')) {
            prefix = this.id + ' ';
        }
        if (prefix) {
            let found = false;
            for(let i in this.commands) {
                if(this.commands[i].isCommand && this.containsCommand(this.commands[i].commands, message, prefix)) {
                    found = true;
                    message = this.removeCommands(this.commands[i].commands, message, prefix);
                    if(this.commands[i].private) {
                        let channel = msg.author.dmChannel;
                        if (channel)
                            msg.author.dmChannel.sendMessage(this.commands[i].rtn(from,message));
                        else
                            msg.channel.sendMessage('Sorry, I had trouble DMing you...');
                        return true;
                    } else {
                        msg.channel.sendMessage(this.commands[i].rtn(from,message));
                        return true;
                    }
                }
            }
            return false;
        }
    }
    checkNonCommands(msg) {
        let from = msg.author.username;
        let message = msg.content;
        for (let i in this.commands) {
            if(!this.commands[i].isCommand) {
                if(contains(this.commands[i].commands, message)) {
                    message = this.removeCommands(this.commands[i], message);
                    if(this.commands[i].private) {
                        msg.author.dmChannel.sendMessage(this.commands[i].rtn(from,message));
                    } else {
                        msg.channel.sendMessage(this.commands[i].rtn(from,message));
                    }
                    break;
                }
            }
        }
    }
    containsCommand(commands, message, prefix) {
        message = message.toLowerCase();
        for(let i = 0; i < commands.length; i++) {
            let command = commands[i].toLowerCase();
            let test = message.substring(prefix.length, prefix.length  + commands[i].length);
            if (command === test) {
                return true;
            }
        }
    }
    removeCommands(commands, message, prefix) {
        prefix = prefix || '';
	let message2 = message.toLowerCase();
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i].toLowerCase();
            let test = message2.substring(prefix.length, prefix.length  + commands[i].length);
            if (command === test) {
                message = message.replace(prefix + command, '');
                break;
            }

        }
        message = message.trim();
        return message;
    }
    updateUser(user, message) {
        user.lastMessage = message;
        this.users[user.id] = user;
    }
    get id() {
        return '<@' + this.client.user.id + '>';
    }

}

function contains(cont, stri) {
    stri = stri.toLowerCase();
    if (!cont) {
        return false;
    }
    if(typeof cont === "string") {
        return stri.indexOf(cont.toLowerCase()) !== -1;
    }
    if(cont[0] === "regex") {
        return stri.search(cont[1]) !== -1;
    }
    for(let i = 0; i < cont.length; i++) {
        if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}

module.exports = Bot;