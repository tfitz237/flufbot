
var irc = require('irc');
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var config = {
        nick: 'pmllbosdft',
        channels: [ '##pmllbot', '##pmll luelinks'],
        mainChannel: '##pmll'
};

var client = new irc.Client('chat.freenode.net', config.nick, { autoRejoin: true, channels: config.channels});
var activeUsers =  [];

client.addListener('registered', function(message) {
    client.say('nickserv', 'identify pmllbot pmllbotrules');
    client.send('nick', 'pmllbot');
});


client.addListener('message', function (from, to, message) {
    addActiveUser(from);
    checkMessage(from, to, message);
});

client.addListener('join'+config.mainChannel, function(from) {
        addActiveUser(from);
        if(from != "pmllbot") {
            client.say(config.mainChannel, "Hey, " + from + "! Currently the active users are: " + getActiveUsers(from));
        }
});

client.addListener('part'+config.mainChannel, function(nick) {
    setInactive(nick);
} )
client.addListener('nick', function(oldnick, newnick, channels) {
    if(channels.indexOf(config.mainChannel) !== -1) updateName(oldnick,newnick);

});
setActiveUsers();
setInterval(setActiveUsers, 60000);


var commands = [
    {
        name: 'activeUsers',
        commands: ["who's here", "who's active", "activeUsers", "active", "whos here", "rolecall", "roll call", "online"],
        rtn: function(from) { return 'The current active users are: ' + getActiveUsers() },
        isCommand: true,
        private: false
    },
    {
        name: 'roll a die',
        commands: ["roll me a die", "dice", "roll it", "1d6", "roll a die"],
        rtn: function() {return 'Rolling a 1d6 gave me: ' + Math.floor((Math.random() * 6) + 1) },
        isCommand: true,
        private: false
    },
    {
        name: 'smoq',
        commands: ["toke", "smoq", "smoak", "smock", "ne14atoke", "neversmokealone"],
        rtn: function(from) { return from + " wants to smoke! who will smoke with him?! " + getActiveUsers(from)},
        isCommand: false,
        private: false
    },
    {
        name: 'away',
        commands: ["away", "inactive"],
        rtn: function(from) { setInactive(from); return from + ' is now away.'},
        isCommand: true,
        private: false
    },
/*    {
        name: 'fuckkiwibot',
        commands: ["kiwibot", "fuckkiwibot"],
        rtn: function(from) {return 'Hey! Kiwibot sucks, I rule.'},
        isCommand:false,
        private: false
    }, */
    {
        name: 'commands',
        commands: ['help', 'commands'],
        rtn: function() {
            var cmds = '';
            for(var i = 0; i < commands.length; i++) {
                cmds += "Command: " + commands[i].name + " or [" + commands[i].commands.join(", ") + "]";
                if (commands[i].isCommand) cmds += "(requires 'pmllbot' or '~')";
                cmds += "\n";
            }
            return 'I can currently do these commands:\n' + cmds + '\nThere are other ways to trigger them, but I\'m sure you\'ll figure them out';
        },
        isCommand: true,
        private: true
    },
    {
        name: 'random quote',
        commands: ["random quote", "rand quote", "randquote", "quote random"],
        rtn: showQuote,
        isCommand:true,
        private:false
    },
    {
        name: 'add quote "<quote> quote"',
        commands: ['add quote', 'addquote', 'quoteadd', 'quote add'],
        rtn: addQuote,
        isCommand: true,
        private:false
    },
    {
        name: 'show quote [#]',
        commands: ['show quote', 'showquote', 'quoteshow', 'quote show'],
        rtn: showQuoteOne,
        isCommand: true,
        private: false
    }
];


function checkMessage(from, to, message) {
    var current = new Date();
    if(to == "pmllbot") var sendTo = from; else var sendTo = config.mainChannel
    if(from == "pmllbot") return;
    if (contains(['pmllbot','~'], message)) {
        var found = false;
        for(var i = 0; i < commands.length; i++) {
            if(contains(commands[i].commands, message) && commands[i].isCommand) {
                found = true;
                if(commands[i].private) {
                    client.say(from, commands[i].rtn(from,message));
                } else {
                    client.say(sendTo, commands[i].rtn(from,message));
                }
                break;
            }
        }
        if(!found && contains(['pmllbot'], message)) client.say(sendTo, 'Yo, ' + from + ', what\'s up?');
    }
    for (var i = 0; i < activeUsers.length; i++) {
        if(contains(activeUsers[i].name,message)) {
            if(!activeUsers[i].active && (activeUsers[i].pinged.getTime()  + 60000 <= current.getTime()) && (activeUsers[i].lastActive.getTime() + 600000 <= current.getTime())) {
                client.say(sendTo, activeUsers[i].name + ' was last active ' + moment.duration(activeUsers[i].lastActive.getTime() - new Date().getTime()).humanize(true));
                activeUsers[i].pinged = current;
                break;
            }
        }

    }
    for ( var i = 0; i < commands.length; i++) {
        if(!commands[i].isCommand) {
            if(contains(commands[i].commands, message)) {
                if(commands[i].private) {
                    client.say(from, commands[i].rtn(from,message));
                } else {
                    client.say(sendTo, commands[i].rtn(from,message));
                }
                break;
            }
        }
    }
}

function addActiveUser(user) {
    if(user == "pmllbot") return;

    if(activeUsers.length == 0) {
        activeUsers.push({name: user, lastActive: new Date(), active: true});
    } else {
        var found = false;
        for (var i = 0; i < activeUsers.length; i++) {
            if(activeUsers[i].name == user) {
                activeUsers[i].lastActive = new Date();
                activeUsers[i].active = true;
                activeUsers[i].pinged = new Date();
                return;
            }
        }
        activeUsers.push({name: user, lastActive: new Date(), active:true, pinged: new Date()});
    }


}


function setActiveUsers() {
    var current = new Date();
    for (var i = 0; i < activeUsers.length; i++) {
        if(activeUsers[i].lastActive.getTime() + 900000 <= current.getTime()) {
            activeUsers[i].active = false;
        }
    }
    console.log('current active users:');
    console.log(getActiveUsers());
}
function setInactive(from) {
    for (var i = 0; i < activeUsers.length; i++) {
        if(activeUsers[i].name == from) {
            activeUsers[i].active = false;
            activeUsers[i].pinged = new Date();
        }
    }
}

function getActiveUsers(from) {
    var rtn = '';
    for (var i = 0; i < activeUsers.length; i++) {
        if(activeUsers[i].active && activeUsers[i].name != from) {
            rtn += activeUsers[i].name;
            if(activeUsers.length - 1  != i) {
                rtn += ", ";
            }
        }
    }
    return rtn;
}

function updateName(oldnick,newnick) {
    for (var i = 0; i < activeUsers.length; i++) {
        if(activeUsers[i].name == oldnick) {
            activeUsers[i].name = newnick;
            break;
        }
    }
}

function contains(cont, stri) {
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




function addQuote(user,quote) {
    var quotes = getQuotes();
    quote = quote.split('"')[1];
    quotes.push({user:user, quote:quote, createdAt: new Date()});
    fs.writeFile('quotes.json', JSON.stringify(quotes));
    return "Added quote to number [" + (quotes.length - 1)+"]";
}

function showQuote() {
    var quotes = getQuotes();
    var num =  Math.floor((Math.random() * quotes.length));
    return "[" + num + "]-> " + quotes[num].quote;
}
function showQuoteOne(from, message) {
    var quotes = getQuotes();
    var num;
    try {
        num = message.split("[")[1];
        num = parseInt(num.substring(0,num.length - 1));
    } catch (e) {
        num = 0;
    }
    var quote;
    try {
        var quote = quotes[num];
        return "[" + num + "]-> " + quote.quote;
    }
    catch (e) {
        return;
    }
}

function getQuotes() {
    var quotes = JSON.parse(fs.readFileSync('quotes.json'));
    return quotes;
}
