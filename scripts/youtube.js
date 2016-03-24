var request = require('sync-request');

exports.youtubeInfo = function(bot) {
    return {
        name: 'youtubeInfo',
        commands: ["regex", "(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\-_]+)"],
        isCommand: false,
        private: false,
        rtn: (from, message) => getInfo(message)
    };
}


function getInfo(message) {
    var res = request('GET','https://www.youtube.com/oembed?url='+message+'&format=json');
    try {
        var body = JSON.parse(res.getBody());
        return body.title +" by " + body.author_name;
    } catch (e) {

    }
}
