let request = require('sync-request');
let yt_regex = "(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\-_]+)";
exports.youtube = function(bot) {
    return {
        name: 'youtube search',
        commands: ['youtube', 'yt', 'video'],
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
        commands: ["regex", yt_regex],
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



exports.playYoutube = function(bot) {
    return {
        name: 'playYoutube',
        commands: ['playYoutube', 'playYT', 'playAudio', 'play audio'],
        isCommand: true,
        private: false,
        rtn: (frm, message) => {
            let match = message.match(yt_regex);
            if (match[1]){
                let audioStream = ytdl("https://www.youtube.com/watch?v=" + match[1]);
                this.voiceHandler = voiceConnection.playStream(audioStream);

                this.voiceHandler.once("end", rtn => {
                    this.voiceHandler = null;
                })
            }
        },
        connectAudio: (bot) => {
            console.log(bot);
            let voice_channel = bot.client.channels.find(chn => chn.name === "Music" && chn.type === "voice");
            voice_channel.join().then(connection => {this.audio = connection;}).catch(console.error);
        }

    };



    function playMusic(ytLink) {
        audio.playStream(ytdl("https://youtube.com/watch?v="+ytLink))
    }
}