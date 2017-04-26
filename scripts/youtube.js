let request = require('sync-request');
exports.youtube = function(bot) {
    return {
        name: 'youtube search',
        commands: ['youtube', 'yt', 'video', 'play'],
        isCommand: true,
        private: false,
        rtn: (from, message) => {
            let message = replaceAll(commands.youtube.commands, message);
            let res = request('GET', 'https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=' + message + '&type=video&maxResults=2&key=AIzaSyBzYm2pH-GdIPTlf4rjQ8aiE-ZB_EHKMOE');
            try {
                let data = JSON.parse(res.getBody());
                let urls = [];
                for (let i = 0; i < data.items.length; i++) {
                    let result = data.items[i];
                    urls.push("https://www.youtube.com/watch?v=" + result.id.videoId);
                }
                urls = urls.join('\n');
                return urls;
            } catch (e) {
                console.log(e);
            }
        }
    };
    function replaceAll(commands, message) {
        message = message.replace('<@' + bot.client.user.id + '>', '');
        message = (message.substring(1, 1) === "!") ? message.substring(1, message.length) : message;
        for (let i = 0; i < commands.length; i++) {
            message = message.replace(commands[i], '');
        }
        message = message.trim();
        return message;
    }
};


let youtubeInfo = function(bot) {
    return {
        name: 'youtubeInfo',
        commands: ["regex", "(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\-_]+)"],
        isCommand: false,
        private: false,
        rtn: (from, message) => getInfo(message)
    };
};


function getInfo(message) {
    let res = request('GET','https://www.youtube.com/oembed?url='+message+'&format=json');
    try {
        let body = JSON.parse(res.getBody());
        return body.title +" by " + body.author_name;
    } catch (e) {
        console.log(e);
    }
}