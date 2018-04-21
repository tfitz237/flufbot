
exports.teams =  function(bot) {
    return {
        name: 'custom teams',
        commands: ["customteams", "teams"],
        rtn: (from, message, msgObject) => {

        },
        isCommand: true,
        private: false
    };
};