#!/usr/bin/env node

'use strict';

var AgileBot = require('../lib/agilebot');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 *  BOT_CHANCE_OF_REACTION: Number from 0 to 100 defining a chance that the bot will react to a message.
 */
var token = process.env.BOT_API_KEY || '{ENTER YOUR API KEY HERE}';
var dbPath = process.env.BOT_DB_PATH || "data/agilebot.db";
var name = process.env.BOT_NAME || "agilebot";
var chanceOfReaction = process.env.BOT_CHANCE_OF_REACTION || 100;

var agilebot = new AgileBot({
    token: token,
    dbPath: dbPath,
    name: name,
    chanceOfReaction: chanceOfReaction

});

agilebot.run();
