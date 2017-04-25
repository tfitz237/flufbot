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
let activeUsers = function(bot) {
    return {
        name: 'activeUsers',
        commands: ["who's here", "who's active", "activeUsers", "active", "whos here", "rolecall", "roll call", "online"],
        isCommand: true,
        private: false,
        rtn: () => 'The current active users are: ' + bot.getActiveUsers()
    };
}
let away = function(bot) {
    return {
        name: 'away',
        commands: ["away", "inactive"],
        isCommand: true,
        private: false,
        rtn: (from, message) => {
            bot.setInactiveUser(from);
            message = message.replace('~','').replace('pmllbot ','').replace('pmllbot','');
            var away = message.split(' ')[1];
            bot.setAway(from, away);
            return from + ' is now away.'
        }
    };
}
