'use strict';
const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/location', (request,response) => {
  try {
    let city = request.query.city;
    let geo = require('./data/geo.json');

    let location = new Location (geo[0],city);
    response.send(location);
  }
  catch(err) {
    console.error(err)
  }
})

app.get('/weather', (request,response) => {
  try {

    let city = request.query.search_query;
    let formatted_query = request.query.formatted_query;
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;

    let weather = require('./data/darksky.json');

    let weatherArr = weather.daily.data;
    const forecastArr =  weatherArr.map((day => {
      return new Weather(day)
    }))

    response.send(forecastArr);
    console.log(forecastArr)
  }
  catch(err) {
    console.error(err)
  }
})

/// location
function Location(obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

/// weather

function Weather(obj) {
  this.time = new Date(obj.time * 1000).toDateString()
  this.forecast = obj.summary;
}





app.get('*',(request,response)=>{
  response.status(404).send('there is nothing on this page');
})
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

