'use strict';
const superagent = require('superagent');
require('dotenv').config();

function getTrail(request,response) {

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
}

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

module.exports = getTrail;
