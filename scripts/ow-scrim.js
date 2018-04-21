
exports.owscrim =  function(bot) {
    const teams = [];
    const matches = [];
    let currentMatch = 0;

    let voiceChannels = {
        lobby: null,
        teams: []
    }

    function movePlayers(where) {
        switch(where) {
            case 'start':
                matches[currentMatch].teams.forEach(teamId => {
                    let team = teams.find(t => t.id = teamId);
                    const moved = [];
                    team.players.forEach((member) => {
                        member.setVoiceChannel(voiceChannels.teams[teamId - 1]).then(m => {
                            console.log(m.displayName);
                        }).catch(m => console.log(m))
                    });
                });
                return 'Moving Players! Match has begun.';
                break;
            case 'pause':
                matches[currentMatch].teams.forEach(teamId => {
                    let team = teams.find(t => t.id = teamId);
                    team.players.forEach((member) => {
                        member.setVoiceChannel(voiceChannels.lobby);
                    });
                });
                return 'Moving Players! Match has been put on hold.';
                break;
        }
    }

    return {
        name: 'overwatch scrims',
        commands: ["owscrim", "owskirm"],
        rtn: (from, message, msgObject) => {
            let command = bot.getSubCommand(message, 1);
            console.log(command);
            if (command === 'test') {

                var person = msgObject.mentions.members;
                const guild = bot.client.guilds.find('id', '323963682084356097');
                const channel = guild.channels.find(channel => channel.name.toLowerCase() === 'lobby');
                person.first().setVoiceChannel(channel).then(m => console.log(person.first().displayName));
            }
            if (command === 'team') {
                let teamnumber = bot.getSubCommand(message, 2);
                let team = teams[teamnumber - 1];
                if (!team) {
                    teams.push({
                        id: teamnumber,
                        name: bot.getSubCommand(message, 3),
                        players: msgObject.mentions.members,
                        wins: 0,
                        matches: [currentMatch]
                    });
                    matches[currentMatch].teams.push(teams.find(x => x.id === teamnumber).id);

                } else {
                    teams[teamnumber - 1] = {
                        id: teamnumber,
                        name: bot.getSubCommand(message, 3),
                        players: msgObject.mentions.users,
                        wins: 0,
                        matches: [currentMatch]
                    };
                    matches[currentMatch].teams.push(teams.find(x => x.id === teamnumber).id);
                }

                return 'Team **' + teams[teamnumber - 1].name +'** created. Create a round with `owscrim round [type] [(optional)start]`';
            }
            if (command === 'match') {
                let subcommand = bot.getSubCommand(message, 2);
                switch(subcommand) {
                    case 'create':
                        currentMatch = matches.length;
                        matches.push({
                            id: matches.length,
                            name: message.replace(command, '').replace(subcommand, ''),
                            teams: [],
                            rounds: []
                        });
                        return 'Match **'+matches[currentMatch].name+'** created. Next step: `owscrim team [teamnumber] [teamname(nospaces)] @tagteammembers`';
                        break;
                    case 'start':
                    case 'pause':
                        return movePlayers(subcommand);
                        break;
                }
            }
            if (command === 'score') {
                let score = bot.getSubCommand(message, 2).split('-');
                let team1wins = score[0] > score[1];
                matches[currentMatch].rounds[matches[currentMatch].rounds.length - 1].scores = {
                    team1: score[0],
                    team2: score[1]
                };
                console.log(teams, matches[currentMatch].teams[0]);
                if (team1wins) {
                    teams.find(t => matches[currentMatch].teams[0] === t.id).wins++;
                } else {
                    teams.find(t => matches[currentMatch].teams[1] === t.id).wins++;
                }
                return 'Score recorded. Team ' + team1wins ?  teams.find(t => matches[currentMatch].teams[0] === t.id).name :  teams.find(t => matches[currentMatch].teams[1] === t.id).name + ' wins!';
            }
            if (command === 'round') {
                let type = bot.getSubCommand(message, 2);
                matches[currentMatch].rounds.push({
                    type: type,
                    scores:  {
                        team1: 0,
                        team2: 0
                    }
                });
                console.log(matches[currentMatch].rounds, matches[currentMatch].rounds.length);
                if (bot.getSubCommand(message, 3) === 'start') {
                    movePlayers('start');
                    return 'Round '+(matches[currentMatch].rounds.length) +' has begun! Players have been moved.';
                }
                return 'Round '+(matches[currentMatch].rounds.length)+' has been created. `owscrim match start` to start the match and move players';
            }
            if (command === 'voice') {
                const team = bot.getSubCommand(message, 2);
                const guild = bot.client.guilds.find('id', '323963682084356097');
                const channel = guild.channels.find(channel => channel.name.toLowerCase() === bot.getSubCommand(message, 3));
                console.log(guild.channels);
                console.log(bot.getSubCommand(message, 3));

                if (channel) {
                    if (team === 'lobby') {
                        voiceChannels.lobby = channel;
                    } else {
                        voiceChannels.teams[team - 1] = channel;
                    }
                    return 'Voice Channel set';
                } else {
                    return 'Could not find voice channel';
                }
            }
            if (command === 'help') {
                var retn = '';
                retn += '* __Overwatch Srim commands__ * \n';
                retn += '```\n';
                retn += '!owscrim voice [team number / \'lobby\'] [voice channel name (plz no spaces if possible)] // Sets a voice channel for a team or the lobby\n';
                retn += '!owscrim match create [match name] // Creates a match with the given name\n';
                retn += '!owscrim team [team number] [team name] [list of @mention team members]\n';
                retn += '!owscrim round [type] [(optional)start] // Creates a round with the given type. Optional parameter to move players to respective channels\n';
                retn += '!owscrim score [team1score]-[team2score] // 3-2 would mean team 1 won that round\n';
                retn += '!owscrim match start // Moves players to respective channels for their assigned teams\n';
                retn += '!owscrim match pause // Moves all players back to lobby\n';
                retn += '```';
                return retn;
            }
        },
        isCommand: true,
        private: false
    };
};