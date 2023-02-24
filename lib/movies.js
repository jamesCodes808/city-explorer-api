'use strict'

require('dotenv').config();
const axios = require('axios');

let cache = require('./cache');
const TMDB_CLIENT_ID = process.env.MOVIE_API_KEY;

class Movie {
    constructor(title, popularity, posterImgPath, releaseDate, averageVotes, overview, adult, id) {
        this.posterImgPath = `https://image.tmdb.org/t/p/w500//${posterImgPath}`,
            this.title = title,
            this.popularity = popularity,
            this.releaseDate = releaseDate,
            this.averageVotes = averageVotes,
            this.overview = overview,
            this.adult = adult,
            this.id = id
    }
};

function getMovies(searchQuery) {
    const key = `movie-${searchQuery}`;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_CLIENT_ID}&language=en-US&page=1&query=${searchQuery}`

    if (cache[key] && (Date.now() - cache[key].timestamp < 1000000)) {
        console.log('cache hit')
    } else {
        console.log('cache miss')
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = axios.get(url)
            .then(response => parseMovies(response.data))
    }

    return cache[key].data;
};

function parseMovies(movieData) {
    try {
        const movieSummaries = movieData.data.map(movie => {
            return new Movie(
                movie.title,
                movie.popularity,
                movie.poster_path,
                movie.release_date,
                movie.vote_average,
                movie.overview,
                movie.adult,
                movie.id
            )
            console.log(movie.title)
        });
        return Promise.resolve(movieSummaries);
    } catch (e) {
        return Promise.reject(e)
    }
};


// const getMovies = async (request, response) => {
//     let arrOfMovies = [];

//     console.log(request.query.query)

//     let movieProxy = {
//         url: `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_CLIENT_ID}&language=en-US&page=1&query=${request.query.query}`,
//         method: 'GET'
//     };

//     let movieResult = await axios(movieProxy);

//     movieResult.data.results.forEach(movie => {
//         arrOfMovies.push(
//             new Movie(
//                 movie.title,
//                 movie.original_language,
//                 movie.popularity,
//                 movie.poster_path,
//                 movie.release_date,
//                 movie.vote_average,
//                 movie.overview,
//                 movie.adult,
//                 movie.id)
//         )
//     });


//     if (movieResult) {
//         response.status(200).send(arrOfMovies);
//     } else {
//         response.status(404).send('data not found')
//     }
// }

module.exports = getMovies;