let request = require('sync-request');

exports.imdb = function (bot) {
  return {
      name: 'imdb search',
      commands: ['imdb', 'movie'],
      isCommand: true,
      private: false,
      rtn: (from, message) => {

          let res = request('GET','http://www.omdbapi.com/?s='+message+'&apikey=55025472');
          try {
              let data = JSON.parse(res.getBody());
              if(data.Search)
                  return 'http://www.imdb.com/title/' + data.Search[0].imdbID+'/';
              return 'No media found.';
          } catch (e) {
              console.log(e);
          }
      }
  }


};