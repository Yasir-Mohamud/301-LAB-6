/* eslint-disable no-undef */

'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', err => console.error(err));

client.connect()
  .then (() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  })

app.get('/location', (request,response) => {
  let city = request.query.city;
  let sql = 'SELECT * FROM location WHERE search_query=$1;';
  console.log('line 27' , sql)
  let safeValues = [city];
  console.log(safeValues)
  client.query(sql, safeValues)
    .then(results => {
      console.log(results);
      if(results.rows.length > 0) {
        response.send(results.row[0])
      } else {
        let urlGeo = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        superagent.get(urlGeo)
          .then(superagentResults => {
            let geo = superagentResults.body;
            let location = new City (geo[0],city);
            let sql = 'INSERT INTO city_explorer_table (search_query, formatted_query, latitude,longitude) VALUES ($1, $2, $3, $4);';
            let safeValues = [city, location.formatted_query, location.latitude, location.longitude];
            client.query(sql, safeValues);
          })
          .catch(err => console.error(err))
      }

    });

});

//// location
function City (obj, city) {
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

// app.get('/movies',(request,respond) => {
//   let latitude = request.query.latitude;
//   let longitude = request.query.longitude;
// let urlMovie = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.MOVIE_API_KEY}`





// })


// function Movie (obj) {

//   this.title = obj.title;
//   this.overview = obj.overview;
//   "average_votes": "5.80",
//   "total_votes": "282",
//   "image_url": "https://image.tmdb.org/t/p/w500/pN51u0l8oSEsxAYiHUzzbMrMXH7.jpg",
//   "popularity": "15.7500",
//   "released_on": "2009-09-18"
// }





app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})


