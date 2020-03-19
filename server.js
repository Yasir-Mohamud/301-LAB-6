/* eslint-disable no-undef */

'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/location', (request,response) => {


  let city = request.query.city;

  let urlGeo = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`

  superagent.get(urlGeo)
    .then(superagentResults => {
      let geo = superagentResults.body;

      let location = new City (geo[0],city);
      response.status(200).send(location);
    })
    .catch(err => console.error(err))
});
function City (obj,city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}
app.get('/weather', (request,response) => {

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
});

/// weather

function Weather(obj) {
  this.time = new Date(obj.time * 1000).toDateString()
  this.forecast = obj.summary;
}



app.get('/trails', (request,response) => {

  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let urlTrail = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_API_KEY}`

  superagent.get(urlTrail)
    .then(superagentResults => {
      const theTrail = superagentResults.body.trails.map(trail => {
        return new Trail(trail)
      })
      response.status(200).send(theTrail);
    })
    .catch(err => console.error(err))
});

function Trail (obj) {
  this.name = obj.name ;
  this.location = obj.location;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionsStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}


app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

