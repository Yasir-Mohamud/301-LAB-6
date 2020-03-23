'use strict';
const superagent = require('superagent');
require('dotenv').config();

function getWeather (request,response) {

  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let urlWeather = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`

  superagent.get(urlWeather)
    .then(superagentResults => {
      let weather = superagentResults.body;
      let weatherArr = weather.daily.data;
      const forecastArr =  weatherArr.map(day => {
        return new Weather(day)
      })

      response.status(200).send(forecastArr);
    })
    .catch(err => console.error(err))
}

function Weather(obj) {
  this.time = new Date(obj.time * 1000).toDateString()
  this.forecast = obj.summary;
}


module.exports = getWeather;
