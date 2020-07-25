require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const bot = require("./telegraf");
const cities = require("./current.city.list.min");
const weatherSticker = require("./weatherSticker");
const citiesNames = cities.map(el => el.name);

bot.start(ctx => {
  ctx.reply("Hello, the weather in which city do you want to know?");
  bot.on("message", async ctx => {
    let requestedCity = ctx.update.message.text;
    if (citiesNames.includes(requestedCity)) {
      let response;
      (async () => {
        response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&appid=${process.env.weatherToken}`
        );
        await ctx.reply(
          `Temperature in ${requestedCity} is ${Math.floor(
            (response.data.main.temp - 273.15) * 100
          ) / 100} °С\n`
        );
        await ctx.reply(
          response.data.weather[0].description[0].toUpperCase() +
            response.data.weather[0].description.substr(
              1,
              response.data.weather[0].description.length
            )
        );
        await weatherSticker(response.data).forEach(sticker =>
          ctx.replyWithSticker(sticker)
        );
      })();
    } else ctx.reply("I don't have information about such city");
  });
});

bot.launch();
