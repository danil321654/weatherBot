const axios = require("axios");
const Levenshtein = require("levenshtein");
const {Markup} = require("telegraf");
const KtoC = require("../util/temp");
const cities = require("../util/current.city.list.min");
const weatherSticker = require("../util/weatherSticker");
const translit = require("../util/translit");
const citiesNamesCountries = cities.map(el => {
  return {id: el.id, name: el.name, country: el.country};
});

module.exports = async (ctx, city = undefined) => {
  let requestedCity = !city ? ctx.update.message.text : city;
  let res;
  if (requestedCity.split(" ").length == 1) {
    requestedCity = {
      city: requestedCity
        .toLowerCase()
        .split("-")
        .map(
          cityPart =>
            cityPart[0].toUpperCase() +
            cityPart
              .split("")
              .slice(1, cityPart.length)
              .join("")
        )
        .join("-")
    };
    res = citiesNamesCountries
      .map(el => {
        return {
          ...el,
          diffCity: Levenshtein(el.name, requestedCity.city)
        };
      })
      .filter(el => el.diffCity < 2)
      .sort((a, b) => a.diffCity - b.diffCity);
  } else if (requestedCity.split(" ").length == 2) {
    requestedCity = {
      city: requestedCity
        .split(" ")[0]
        .toLowerCase()
        .split("-")
        .map(
          cityPart =>
            cityPart[0].toUpperCase() +
            cityPart
              .split("")
              .slice(1, cityPart.length)
              .join("")
        )
        .join("-"),
      country: requestedCity.split(" ")[1].toUpperCase()
    };
    res = citiesNamesCountries
      .map(el => {
        return {
          ...el,
          diffCity: Levenshtein(el.name, requestedCity.city),
          diffCountry: Levenshtein(el.country, requestedCity.country)
        };
      })
      .filter(el => el.diffCity < 2 && el.diffCountry === 0)
      .sort((a, b) => a.diffCity + a.diffCountry - b.diffCity - b.diffCountry);
  } else ctx.reply("Bad request");
  if (res.length == 1) {
    let response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${res[0].id}&appid=${process.env.weatherToken}`
    );
    await ctx.reply(
      `Temperature in ${res[0].name} is ${KtoC(
        response.data.main.temp
      )} °С\nFeels like ${KtoC(response.data.main.feels_like)}°С\n`
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
  } else if (res.length > 1) {
    await ctx.reply("Choose right city:", {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          ...res.map(el => [
            Markup.callbackButton(
              `${el.name} ${el.country}`,
              `${el.name} ${el.country}`
            )
          ]),
          [Markup.callbackButton(`go back`, `-1`)]
        ]
      })
    });
  } else ctx.reply("I don't have information about such city");
};
