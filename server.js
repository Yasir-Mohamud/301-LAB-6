'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static('./public'));
app.get('./', (require,respond) => {
  try {
    let city = require.query.city;
    let geo = require('./data/geo.json');

    let location = new Location (geo[0],city);
    respond.send(location);
  }
  catch(err){console.error(err)}
})

function Location(obj, city) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon
}



app.listen(PORT, () => console.log(`listenign on port ${PORT}`));
app.use('*', (require,respond) => respond.send('Sorry , that route does not exist.'));
