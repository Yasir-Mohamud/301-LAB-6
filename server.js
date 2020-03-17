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

function Location(obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


app.use('*', (request,response) => response.send('Sorry , that route does not exist.'));
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

