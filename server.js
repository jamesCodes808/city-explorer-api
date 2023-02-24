'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const getWeather = require('./lib/weather');
const getMovies = require('./lib/movies');
const app = express();

const PORT = process.env.PORT;

app.use(cors());


app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
    console.log(request)
    const { cityName, lat, lon } = request.query;
    getWeather(cityName, lat, lon)
        .then(summaries => response.send(summaries))
        .catch((error) => {
            console.log(error)
            response.status(200).send('')
        });
};

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