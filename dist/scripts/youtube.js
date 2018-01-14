'use strict';

var ytdl = require('ytdl-core');
var request = require('sync-request');
var yt_regex = "(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch(?:\.php)?\?.*v=)([a-zA-Z0-9\-_]+)";

exports.youtube = function (bot) {
    return {
        name: 'youtube search',
        commands: ['youtube', 'yt', 'video'],
        isCommand: true,
        private: false,
        rtn: function rtn(from, message) {
            var res = request('GET', 'https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=' + message + '&type=video&maxResults=2&key=AIzaSyBzYm2pH-GdIPTlf4rjQ8aiE-ZB_EHKMOE');
            try {
                var data = JSON.parse(res.getBody());
                var urls = [];
                for (var i = 0; i < data.items.length; i++) {
                    var result = data.items[i];
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

exports.playYoutube = function (bot) {
    return {
        name: 'playYoutube',
        commands: ['playYoutube', 'playYT', 'playAudio', 'play audio', 'play'],
        isCommand: true,
        private: false,
        rtn: function rtn(frm, message) {
            var match = message.match(yt_regex);
            var id = void 0;
            if (match && match[1]) {
                id = match[1];
            } else {
                id = searchYoutube(message);
            }
            var channel = bot.client.channels.find(function (chn) {
                return chn.name === "bot_music" && chn.type === "text";
            });
            ytdl.getInfo(getYoutubeLink(id), function (error, info) {
                if (error) {
                    channel.sendMessage("The requested video (" + match[1] + ") does not exist or cannot be played.");
                    console.log("Error (" + match[1] + "): " + error);
                } else {
                    addToQueue(id, info, channel);
                }
            });
        },
        connectAudio: function connectAudio(bot) {
            var voice_channel = bot.client.channels.find(function (chn) {
                return chn.name === "Music" && chn.type === "voice";
            });
            voice_channel.join().then(function (connection) {
                bot.audio = bot.audio || {};
                bot.audio.connection = connection;
            }).catch(console.error);
        },
        playNext: playNext

    };

    function playMusic(channel, video) {
        var audioStream = ytdl(getYoutubeLink(video.link), { filter: 'audioonly' });
        var voiceHandler = bot.audio.connection.playStream(audioStream, { volume: 0.8 });
        voiceHandler.on("debug", function (msg) {
            console.log(msg);
        });
        voiceHandler.on("error", function (v) {
            return console.log(v);
        });
        voiceHandler.on("start", function (v) {
            bot.audio.playing = true;
            channel.sendMessage("Now Playing: " + getYoutubeLink(video.link) + "\n");
        });
        voiceHandler.once("end", function (rtn) {
            channel.sendMessage("Song stopped.");
            bot.audio.playing = playNext(channel);
            voiceHandler = null;
        });
    }

    function addToQueue(id, info, channel) {
        bot.audio.tracks = bot.audio.tracks || [];
        bot.audio.tracks.push({
            link: id,
            info: info
        });
        if (!bot.audio.playing) {
            playNext(channel);
        } else {
            channel.sendMessage("Added to queue: " + info.title);
        }
    }

    function playNext(channel) {
        if (bot.audio.current === null || typeof bot.audio.current === "undefined") {
            bot.audio.current = -1;
        }
        if (bot.audio.tracks[bot.audio.current]) bot.audio.tracks[bot.audio.current].played = true;
        if (bot.audio.tracks[bot.audio.current + 1]) {
            bot.audio.current = bot.audio.current + 1;
            playMusic(channel, bot.audio.tracks[bot.audio.current]);
            return true;
        } else {
            return false;
        }
    }
};

exports.playNext = function (bot) {
    return {
        name: 'play next song in queue',
        commands: ['playnext', 'next'],
        isCommand: true,
        private: false,
        rtn: function rtn(frm, message) {
            var channel = bot.client.channels.find(function (chn) {
                return chn.name === "bot_music" && chn.type === "text";
            });
            bot.commands.playYoutube.playNext(channel);
        }
    };
};

exports.queue = function (bot) {
    return {
        name: 'display queue',
        commands: ['queue', 'whatsnext', 'showqueue', 'what\'s next', 'whatsplaying', 'what\'s playing'],
        isCommand: true,
        private: false,
        rtn: function rtn() {
            var channel = bot.client.channels.find(function (chn) {
                return chn.name === "bot_music" && chn.type === "text";
            });
            var channel2 = bot.client.channels.find(function (chn) {
                return chn.name === "bot_queue" && chn.type === "text";
            });
            var queue = displayQueue(bot);
            channel.sendMessage(queue);
            channel2.sendMessage(queue);
        }
    };

    function displayQueue(bot) {
        if (!bot.audio.tracks) return 'There are no songs in the queue';
        var queue = bot.audio.tracks.filter(function (track) {
            return !track.played;
        });
        queue = queue.map(function (track) {
            var rtn = '*';
            if (track.link === bot.audio.tracks[bot.audio.current].link) {
                rtn += 'Now Playing: ';
            }
            rtn += track.info.title;
            return rtn;
        }).join('\n');
        return 'Current Queue: \n' + queue;
    }
};

function searchYoutube(query) {
    var res = request('GET', 'https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=' + query + '&type=video&maxResults=2&key=AIzaSyBzYm2pH-GdIPTlf4rjQ8aiE-ZB_EHKMOE');
    try {
        var data = JSON.parse(res.getBody());
        if (data.items.length > 0) {
            return data.items[0].id.videoId;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

function getYoutubeLink(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

function getInfo(message) {
    var res = request('GET', 'https://www.youtube.com/oembed?url=' + message + '&format=json');
    try {
        var body = JSON.parse(res.getBody());
        return body.title + " by " + body.author_name;
    } catch (e) {
        console.log(e);
    }
}
//# sourceMappingURL=youtube.js.map