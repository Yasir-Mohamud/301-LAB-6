'use strict';
const superagent = require('superagent');
const client = require('./client')
require('dotenv').config();



function getLocation (request,response) {
  let city = request.query.city;
  let sql = 'SELECT * FROM locations2 WHERE search_query=$1;';
  let safeValues = [city];
  client.query(sql, safeValues)
    .then(results => {
      if(results.rows.length>0) {
        response.send(results.rows[0])
      } else {
        let urlGeo = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        superagent.get(urlGeo)
          .then(superagentResults => {
            let geo = superagentResults.body;
            let location = new City (geo[0],city);
            let sql = 'INSERT INTO locations2 (search_query, formatted_query, latitude,longitude) VALUES ($1, $2, $3, $4);';
            let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
            client.query(sql, safeValues)
              .then ((data) => {
                response.send(data);
              })
          })
          .catch(err => console.error(err))
      }

    });

}

//// location
function City (obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

module.exports = getLocation;
