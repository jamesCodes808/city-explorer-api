'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./lib/weather');
const getMovies = require('./lib/movies');
const app = express();

const PORT = process.env.PORT;

app.use(cors());


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