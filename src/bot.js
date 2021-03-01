require("dotenv").config();
const fs = require("fs");

const bot = require("./telegraf");
const replyWithWeather = require("./controllers/replyWithWeather");

bot.start(ctx => {
  ctx.reply("Hello, the weather in which city do you want to know?");
});
bot.on("message", async ctx => replyWithWeather(ctx, ctx.update.message.text));

bot.action(/^[A-Za-z ]+$/, async ctx =>
  replyWithWeather(ctx, ctx.update.callback_query.data)
);
bot.action("-1", async ctx =>
  ctx.reply("Hello, the weather in which city do you want to know?")
);
bot.launch();
