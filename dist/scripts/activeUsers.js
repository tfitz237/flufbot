'use strict';

/* return format:
exports.name = function(bot) {
    return {
        name: '__NAME__',
        commands: ['__COMMAND1__', '__COMMAND2__'],
        isCommand: true,
        private: false
        rtn: function(from, to, message) { return 'blah';}
    }
}
*/
//exports.activeUsers =
function asdf(bot) {
    function getActiveUsers(bot, ping) {
        var users = bot.users;
        var rtn = [];
        for (var i in users) {
            if (checkIfActive(users[i]) && users[i] !== bot.client.user) {
                rtn.push(ping ? '<@' + users[i].id + '>' : users[i].username);
            }
            rtn.join(', ');
        }
        return rtn;
    }

    return {
        name: 'activeUsers',
        commands: ["who's here", "who's active", "activeUsers", "active", "whos here", "rollcall", "roll call", "online"],
        isCommand: true,
        private: false,
        rtn: function rtn() {
            return 'The current active users are: ' + getActiveUsers(bot, false);
        },
        get: function get(bot, ping) {
            return getActiveUsers(bot, ping);
        }
    };
};

function checkIfActive(user) {
    if (user.lastMessage.createdTimestamp + 1800000 >= Date.now()) {
        return true;
    }
    return false;
}

var away = function away(bot) {
    return {
        name: 'away',
        commands: ["away", "inactive"],
        isCommand: true,
        private: false,
        rtn: function rtn(from, message) {
            bot.setInactiveUser(from);
            message = message.replace('~', '').replace('pmllbot ', '').replace('pmllbot', '');
            var away = message.split(' ')[1];
            bot.setAway(from, away);
            return from + ' is now away.';
        }
    };
};
//# sourceMappingURL=activeUsers.js.map