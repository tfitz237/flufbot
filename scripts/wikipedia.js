
let request = require('sync-request');

exports.wikiSearch = function(bot) {
    return {
        name: 'wikipedia search',
        commands: ['wiki', 'wikipedia'],
        isCommand: true,
        private: false,
        rtn: (from, message) => {
            let res = request('GET', 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+message+'&srwhat=text&srprop=timestamp&format=json' );
            try {
                let data = JSON.parse(res.getBody());
                return 'https://www.wikiwand.com/en/'+encodeURI(data.query.search[0].title.replace(/ /g, '_'));
            } catch (e) {
                console.log(e);
            }

        }
    }
};