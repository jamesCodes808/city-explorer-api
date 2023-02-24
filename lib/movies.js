'use strict'

const axios = require('axios');

const getMovies = async (request, response) => {
    let arrOfMovies = [];

    console.log(request.query.query)

    let movieProxy = {
        url: `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_CLIENT_ID}&language=en-US&page=1&query=${request.query.query}`,
        method: 'GET'
    };

    let movieResult = await axios(movieProxy);

    movieResult.data.results.forEach(movie => {
        arrOfMovies.push(
            new Movie(
                movie.title,
                movie.original_language,
                movie.popularity,
                movie.poster_path,
                movie.release_date,
                movie.vote_average,
                movie.overview,
                movie.adult,
                movie.id)
        )
    });


    if (movieResult) {
        response.status(200).send(arrOfMovies);
    } else {
        response.status(404).send('data not found')
    }
}

module.exports = getMovies;