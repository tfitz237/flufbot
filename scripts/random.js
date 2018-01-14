

exports.nyan = function(bot) {
    return {
        name: 'nyancat',
        commands: ['nyancat', 'nyan', 'rainbowcat'],
        rtn: () => 'http://i.imgur.com/TohPiyP.gif',
        isCommand: true,
        private: false
    }
};