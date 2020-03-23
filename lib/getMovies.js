'use strict';
const superagent = require('superagent');
require('dotenv').config();

function getMovie (request,response) {
  let city = request.query.search_query;
  let urlMovie =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

  superagent(urlMovie)
    .then(superagentResults => {
      let movieArr = superagentResults.body.results;
      let movieInfo = movieArr.map(movie => new Movie (movie));
      response.status(200).send(movieInfo.slice(0,20));
    })

}

function Movie (obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.average_votes;
  this.total_votes = obj.total_votes;
  this.image_url = `https://image.tmdb.org/t/p/w500/${obj.poster_path}`
  this.popularity = obj.popularity;
  this.released_on = obj.released_on;
}

module.exports = getMovie;
