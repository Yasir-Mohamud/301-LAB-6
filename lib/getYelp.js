'use strict';
const superagent = require('superagent')
require('dotenv').config();

function getYelp (request,response) {
  let city = request.query.search_query;
  let urlYelp = `https://api.yelp.com/v3/businesses/search?location=${city}`;
  superagent(urlYelp)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then (superagentResults => {
      let yelpArr = superagentResults.body.businesses
      let yelpInfo = yelpArr.map(business => new Yelp (business))
      response.status(200).send(yelpInfo);
    })

}

function Yelp (obj) {
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}

module.exports = getYelp;
