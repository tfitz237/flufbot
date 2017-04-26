exports.help =  function(bot) {
    return {
        name: 'commands',
        commands: ['help', 'commands'],
        rtn: function() {
            let cmds = '';
            let keys = Object.keys(bot.commands);
            keys.forEach(function(i) {
                cmds += "Command: " + bot.commands[i].name + " or [" + bot.commands[i].commands.join(", ") + "]";
                if (bot.commands[i].isCommand) cmds += "(requires 'pmllbot' or '~')";
                cmds += "\n";
            });
            return 'I can currently do these commands:\n' + cmds;
        },
        isCommand: true,
        private: true
    }
};
