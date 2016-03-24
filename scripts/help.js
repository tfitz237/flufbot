exports.help =  function(bot) {
    return {
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
    }
};
