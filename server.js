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
      response.send(location);
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
      console.log(Weather)
      let weatherArr = weather.daily.data;
      const forecastArr =  weatherArr.map(day => {
        return new Weather(day)
      })
  
      response.send(forecastArr);
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
  let urlTrail = `https://www.hikingproject.com/data/get-trails?${latitude}&${longitude}&maxDistance=10&key=${process.env.TRAILS_API_KEY}`

  superagent.get(urlTrails)
    .then(superagentResults => {
      let trail = superagentResults.body;
      console.log(trail)
      let trailArr = trail.daily.data;
       trailArr.forEach(trail => {

       }
      response.send(trailArr);
    })
    .catch(err => console.error(err))
});

function Trail (obj) {
  this.name = obj. 
  this.location": "Riverbend, Washington",
    this.length": "4.3",
    this.stars": "4.4",
    this.star_votes": "84",
    this.summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
    this.trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
    this.conditions": "Dry: The trail is clearly marked and well maintained.",
    this.condition_date": "2018-07-21",
    this.condition_time": "0:00:00 "
}


app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

