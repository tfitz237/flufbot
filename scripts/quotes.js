/* return format:
exports.name =
{
    name: '__NAME__',
    commands: ['__COMMAND1__', '__COMMAND2__'],
    isCommand: true,
    private: false
    rtn: function(from, to, message) { return 'blah';}
}
*/
var fs = require('fs');

exports.quoteRandom = function(bot) {
    return {
        name: 'random quote',
        commands: ["random quote", "rand quote", "randquote", "quote random"],
        isCommand:true,
        private:false,
        rtn: randQuote
    };
}
exports.quoteAdd = function(bot) {
    return {
        name: 'add quote "<quote> quote"',
        commands: ['add quote', 'addquote', 'quoteadd', 'quote add'],
        isCommand: true,
        private:false,
        rtn: addQuote
    };
}
exports.quoteShow = function(bot) {
    return {
        name: 'show quote [#]',
        commands: ['show quote', 'showquote', 'quoteshow', 'quote show', 'quote'],
        isCommand: true,
        private: false,
        rtn: showQuote
    };
}

function addQuote(user,quote) {
    var quotes = getQuotes();
    quote = quote.split('"')[1];
    quotes.push({user:user, quote:quote, createdAt: new Date()});
    fs.writeFile('quotes.json', JSON.stringify(quotes));
    return "Added quote to number [" + (quotes.length - 1)+"]";
}

function randQuote() {
    var quotes = getQuotes();
    var num =  Math.floor((Math.random() * quotes.length));
    return "[" + num + "]-> " + quotes[num].quote;
}
function showQuote(from, message) {
    var quotes = getQuotes();
    var num;
    var match = /[(0-9)+]/.exec(message);
    num = parseInt(match[0]) || -1;
    var quote;
    try {
        var quote = quotes[num];
        return "[" + num + "]-> " + quote.quote;
    }
    catch (e) {
        return "Could not find that quote #";
    }
}

function getQuotes() {
    var quotes = JSON.parse(fs.readFileSync('quotes.json'));
    return quotes;
}
