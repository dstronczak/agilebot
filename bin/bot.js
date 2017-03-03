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
 */
var token = process.env.BOT_API_KEY || 'xoxb-147988334544-FIX9R0989PZSa7MD91wReTUT';
var dbPath = process.env.BOT_DB_PATH || "data/agilebot.db";
var name = process.env.BOT_NAME || "agilebot";

var agilebot = new AgileBot({
    token: token,
    dbPath: dbPath,
    name: name
});

agilebot.run();
