const weather = require("./weather");

module.exports = weatherData => {
  let stickers = [];

  if (weatherData.weather[0].main === "Storm") {
    stickers.push(weather.storm);
  } else if (weatherData.weather[0].main === "Rain") {
    stickers.push(weather.rainy);
  } else if (weatherData.weather[0].main === "Snow") {
    stickers.push(weather.snow);
  } else if (weatherData.weather[0].main === "Clouds") {
    stickers.push(weather.cloudy);
  } else if (weatherData.main.temp <= 268.15) {
    stickers.push(weather.frozzy);
  } else if (weatherData.main.temp >= 305.15) {
    stickers.push(weather.extraHot);
  } else if (weatherData.main.temp >= 298.15) {
    stickers.push(weather.hot);
  } else if (weatherData.main.temp > 272.15 && weatherData.main.temp < 274.15) {
    stickers.push(weather.nearZero);
  } else if (weatherData.main.temp > 268.15 && weatherData.main.temp < 298.15) {
    stickers.push(weather.sunny);
  }
  if (weatherData.wind.speed >= 5) {
    stickers.push(weather.windy);
  }
  return stickers;
};
