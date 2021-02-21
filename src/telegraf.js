const Telegraf = require("telegraf");
require("dotenv").config();
module.exports = new Telegraf(process.env.token);
