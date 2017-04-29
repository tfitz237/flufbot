exports.help =  function(bot) {
    return {
        name: 'commands',
        commands: ['help', 'commands'],
        rtn: function() {
            let cmds = '';
            let keys = Object.keys(bot.commands);
            keys.forEach(function(i) {
                cmds += "* __" + bot.commands[i].name + "__ --> `" + bot.commands[i].commands.map(cmd => '!' + cmd).join(", ") +'`';
                if (bot.commands[i].isCommand) cmds += " (requires @mention or '!')";
                cmds += "\n";
            });
            return '__Current Commands:__\n ' + cmds;
        },
        isCommand: true,
        private: true
    }
};
