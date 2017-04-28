let request = require('sync-request');
exports.youtube = function(bot) {
    return {
        name: 'youtube search',
        commands: ['youtube', 'yt', 'video', 'play'],
        isCommand: true,
        private: false,
        rtn: (from, message) => {
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