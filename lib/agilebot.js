'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var agileUtils = require("./agileUtils");


// inherits methods and properties from the Bot constructor
class AgileBot extends Bot {
    constructor(settings){
        super(settings)

        this.user = null;
        this.db = null;
        this.dbPath = settings.dbPath;
        this.chanceOfReaction = settings.chanceOfReaction;

        this.on('start', this._onStart);
        this.on('message', this._onMessage);
    }
}


AgileBot.prototype.run = function () {
    var bot = new AgileBot(this,this.settings);
    // AgileBot.super_.call(this, this.settings);

    // this.on('start', this._onStart);
    // this.on('message', this._onMessage);
};

AgileBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
    this._initCategories();
    this._initCommands();

    console.log("Agile bot up and running.");
};

AgileBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];

};

AgileBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

AgileBot.prototype._firstRunCheck = function () {
    var self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        var currentTime = (new Date()).toJSON();

        if (!record) {
            // this is a first run
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        // updates with new last running time
        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

AgileBot.prototype._initCategories = function () {
    this.categories = [];

    var self = this;
    self.db.each('SELECT DISTINCT category FROM quotes', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }


        self.categories.push(record.category);

    });
};

AgileBot.prototype._initCommands = function () {
    var self = this;
    this.commands = [
        {name: "AB|help", function: self._helpCommand},
        {name: "AB|funnymovie", function: self._movieCommand},
        {name: "AB|addquote", function: self._addQuoteCommand},
        {name: "AB|randomuser", function: self._randomUserCommand}

    ];

};

AgileBot.prototype._helpCommand = function (message) {
    var helpText = "Hi! I'm *AgileBot*. " +
        "Sometimes I will randomly post quotes triggered by specific keywords in your messages. " +
        "What keywords, you ask? Well, try _agile_ for example.. \n\n\n" +
            "*Available commands:* \n" +
            "`AB|help` - Print help message. \n" +
            "`AB|funnymovie` - Get a funny movie. \n" +
            "`AB|addquote \<keyword\> \<quote\>` - Add new keyword reaction to database.\n" +
            "`AB|randomuser` - Pick a random user from the current channel.";
    this._respondToMessage(message, helpText);
}

AgileBot.prototype._movieCommand = function (message) {
    var funnyMoviesList = [
        'https://www.youtube.com/watch?v=oLmDe8pAc6I',
        'https://www.youtube.com/watch?v=l1yWusiaLCM',
        'https://www.youtube.com/watch?v=FJezcyKno5k',
        'https://www.youtube.com/watch?v=KP2zznwCeZI',
        'https://www.youtube.com/watch?v=pGFGD5pj03M',
        'https://www.youtube.com/watch?v=DYu_bGbZiiQ',
        'https://www.youtube.com/watch?v=BKorP55Aqvg',

    ];

    var randomMovie = funnyMoviesList.randomElement();
    this._respondToMessage(message, randomMovie);
}

AgileBot.prototype._addQuoteCommand = function (message) {
    var keywordAndQuote = message.text.replace("AB|addquote ", "");
    var quoteEndIndex=keywordAndQuote.indexOf(" ")
    var keyword = keywordAndQuote.substring(0, quoteEndIndex);
    var quote = keywordAndQuote.substring(quoteEndIndex+1);

    if(quote && keyword){
        this._respondToMessage(message, "_Adding new quote_. \n" + "*Keyword*: " + keyword + "\n" + "*Quote*: " + quote);
    }



    this.db.run('INSERT INTO quotes (quote, category) VALUES (?,?)', quote,keyword);
    this._initCategories();


}

AgileBot.prototype._randomUserCommand = function (message) {
    var channel = this._getChannelById(message.channel);
    var channelMemberIDs = channel.members;

    var allUsers = this.getUsers()._value.members;
    var usersOnCurrentChannel = [];

    for(var i=0; i<allUsers.length; i++){
        var userid = allUsers[i].id;
        if(channelMemberIDs.contains(userid) && allUsers[i].name != this.name ){
            usersOnCurrentChannel.push(allUsers[i]);
        }
    }

    var randomUser = usersOnCurrentChannel.randomElement();
    this._respondToMessage(message, "@" + randomUser.name + " (" + randomUser.profile.first_name + " " + randomUser.profile.last_name + ") is the chosen one!");

}



AgileBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys!' +
        '\n Say some an agile keyword invoke me!',
        {as_user: true});
};

AgileBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) && !this._isFromAgileBot(message)

    ) {
        if(this._respondToCommand(message))
            return;

        var category = this._containsCategoryString(message);
        if (category && Math.floor(Math.random()*100+1)<=this.chanceOfReaction)
            this._reply(message, category);
    }
};

AgileBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

AgileBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'; 
};

AgileBot.prototype._isFromAgileBot = function (message) {
    return message.user === this.user.id;
};

AgileBot.prototype._respondToCommand = function (message) {

    var command = this._parseCommand(message);

    if(command){
        command.function.call(this, message);
        return true;
    }

    return false;
};

AgileBot.prototype._parseCommand = function (message) {
    var messageText = message.text;
    for(var i=0; i<this.commands.length; i++){
        var command = this.commands[i].name;
        if(agileUtils.checkIfStartsWithWord(messageText,command)){

            return this.commands[i];
        }
    }
    return null;


};

AgileBot.prototype._containsCategoryString = function (message) {
    var messageLowercase = message.text.toLowerCase();


    for (var i = 0; i < this.categories.length; i++) {
        var category = this.categories[i];

        //check if contains the category word as a whole word
        if (agileUtils.checkIfContainsWholeWord(messageLowercase,category))
            return category;

    }

    return null;
};

AgileBot.prototype._reply = function (originalMessage, category) {

    var self = this;
    self.db.get('SELECT id, quote FROM quotes WHERE category = \'' + category + '\' ORDER BY used ASC, RANDOM() LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        
        self._respondToMessage(originalMessage, category + "? Let me tell you this...");
        setTimeout(function () {
            //delaying the second message
            self._respondToMessage(originalMessage, record.quote)
        }, 1500);

        self.db.run('UPDATE quotes SET used = used + 1 WHERE id = ?', record.id);
    });
};

AgileBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

AgileBot.prototype._respondToMessage = function(message, response) {
    var channel = this._getChannelById(message.channel);
    this.postMessageToChannel(channel.name, response, {as_user: true});
};



module.exports = AgileBot;

