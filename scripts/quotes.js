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
let fs = require('fs');

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
    let quotes = getQuotes();
    quote = quote.split('"')[1];
    quotes.push({user:user, quote:quote, createdAt: new Date()});
    fs.writeFile('quotes.json', JSON.stringify(quotes));
    return "Added quote to number [" + (quotes.length - 1)+"]";
}

function randQuote() {
    let quotes = getQuotes();
    let num =  Math.floor((Math.random() * quotes.length));
    return "[" + num + "]-> " + quotes[num].quote;
}
function showQuote(from, message) {
    let quotes = getQuotes();
    let num;
    let match = /[(0-9)+]/.exec(message);
    num = parseInt(match[0]) || -1;
    let quote;
    try {
        let quote = quotes[num];
        return "[" + num + "]-> " + quote.quote;
    }
    catch (e) {
        return "Could not find that quote #";
    }
}

function getQuotes() {
    let quotes = JSON.parse(fs.readFileSync('quotes.json'));
    return quotes;
}
