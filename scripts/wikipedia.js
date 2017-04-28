
let request = require('sync-request');

exports.wikiSearch = function(bot) {
    return {
        name: 'wikipedia search',
        commands: ['wiki', 'wikipedia'],
        isCommand: true,
        private: false,
        rtn: (from, message) => {
            return 'https://www.wikiwand.com/en/'+encodeURI(message)

        }
    }
}
;