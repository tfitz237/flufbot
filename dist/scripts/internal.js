'use strict';

var logOfUsers = function logOfUsers(bot) {
    return {
        name: 'logusers',
        commands: ["logusers"],
        isCommand: true,
        private: true,
        rtn: function rtn() {
            console.log(bot.activeUsers);return '';
        }
    };
};
//# sourceMappingURL=internal.js.map