'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./lib/weather');
const axios = require('axios');
const getMovies = require('./lib/movies');
const app = express();

const PORT = process.env.PORT;

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

app.get('/weather', getWeather);

app.get('/movie', getMovies);

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