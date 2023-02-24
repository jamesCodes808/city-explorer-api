'use strict'

require('dotenv').config();
const axios = require('axios');

const TMDB_CLIENT_ID = process.env.MOVIE_API_KEY

class Movie {
    constructor(title, originalLanguage, popularity, posterImgPath, releaseDate, averageVotes, overview, adult, id) {
        this.posterImgPath = `https://image.tmdb.org/t/p/w500//${posterImgPath}`,
            this.title = title,
            this.originalLanguage = originalLanguage,
            this.popularity = popularity,
            this.releaseDate = releaseDate,
            this.averageVotes = averageVotes,
            this.overview = overview,
            this.adult = adult,
            this.id = id
    }
};

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