'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');


var AgileBot = function Constructor(settings) {

    this.settings = settings;
    this.settings.name = this.settings.name || 'agilebot';

    this.dbPath = settings.dbPath || path.resolve(__dirname, '..', 'data', 'agilebot.db');


    this.user = null;
    this.db = null;


};

// inherits methods and properties from the Bot constructor
util.inherits(AgileBot, Bot);


AgileBot.prototype.run = function () {
    AgileBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

AgileBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
    this._initCategories();
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
    console.log(self.categories)
};


AgileBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys!' +
        '\n Say `agile` or `' + this.name + '` to invoke me!',
        {as_user: true});
};

AgileBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) && !this._isFromAgileBot(message)

    ) {
        var category = this._containsCategoryString(message);
        if (category)
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

AgileBot.prototype._containsCategoryString = function (message) {
    // if(message.text.toLowerCase().indexOf(this.name = " help") > -1)
    //     return true;
    var messageLowercase = message.text.toLowerCase();


    for (var i = 0; i < this.categories.length; i++) {
        var category = this.categories[i];

        if (messageLowercase.indexOf(category) > -1)
            return category;

    }

    return null;
    // if(message.text.toLowerCase().indexOf( this.messageCategoriesToKeywordsMap.AGILE ) > -1)
    //     return true;
    // else 
    //     return false;
};

AgileBot.prototype._reply = function (originalMessage, category) {
    var self = this;
    self.db.get('SELECT id, quote FROM quotes WHERE category = \'' + category + '\' ORDER BY used ASC, RANDOM() LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }


        var channel = self._getChannelById(originalMessage.channel);

        self.postMessageToChannel(channel.name, category + "? Let me tell you this...", {as_user: true});
        setTimeout(function () {
            self.postMessageToChannel(channel.name, record.quote, {as_user: true});
        }, 1000)

        //self.postMessageToChannel(channel.name, record.quote, {as_user: true});

        self.db.run('UPDATE quotes SET used = used + 1 WHERE id = ?', record.id);
    });
};

AgileBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};


module.exports = AgileBot;

