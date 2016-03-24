exports.logOfUsers = function(bot) {
    return {
        name: 'logusers',
        commands: ["logusers"],
        isCommand: true,
        private: true,
        rtn: () => {console.log(bot.activeUsers);return '';}
    };
}
