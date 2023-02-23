'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const weather = require('./data/weather.json');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT;
const WEATHER_CLIENT_ID = process.env.WEATHER_API_KEY;
const TMDB_CLIENT_ID = process.env.MOVIE_API_KEY;

app.use(cors());

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
};

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

app.get('/weather', async (request, response) => {

    let arrOfForecast = [];

    let weatherProxy = {
        url: `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_CLIENT_ID}&city=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}`,
        method: 'GET'
    };

    let weatherProxyResult = await axios(weatherProxy);
    console.log(weatherProxyResult.data.data)

    weatherProxyResult.data.data.forEach(dailyForecast => {
        arrOfForecast.push(new Forecast(dailyForecast.valid_date, dailyForecast.weather.description))
    })

    console.log(arrOfForecast)

    if (weatherProxyResult.data) {
        response.status(200).send(arrOfForecast);
    } else {
        response.status(404).send('data not found')
    }

});

app.get('/movie', async (request, response) => {
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

});

app.get('/search', (request, response) => {
    response.send('in progress')
})

app.get('/bad-request', (request, response) => {
    throw new Error('Testing Server Error')
})


app.use('*', (request, response) => {
    response.status(404).send('No data found')
});

app.use((err, request, response, next) => {
    // console.log(err.message);
    response.status(500).send('Something went wrong')
});

app.listen(PORT, () => {
    console.log('App is running');
})