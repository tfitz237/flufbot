'use strict';

var request = require('sync-request');

exports.giphy = function (bot) {
    return {
        name: 'gif search',
        commands: ['gif', 'giphy'],
        isCommand: true,
        private: false,
        rtn: function rtn(from, message) {

            var res = request('GET', 'http://api.giphy.com/v1/gifs/translate?s=' + encodeURIComponent(message.replace(' ', '+')) + '&api_key=dc6zaTOxFJmzC');
            try {
                var data = JSON.parse(res.getBody());
                if (data.data) return data.data.url;
                return 'No media found.';
            } catch (e) {
                console.log(e);
            }
        }
    };
};
//# sourceMappingURL=giphy.js.map