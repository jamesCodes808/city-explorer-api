'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express();

const PORT = process.env.PORT;

app.use(cors());


class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

app.get('/weather', (request, response) => {
    let result = null;
    let arrOfForecast = [];

    console.log(request.query)

    if (request.query.city_name) {
        weather.forEach(item => {
            if (item.city_name.toLowerCase() === request.query.city_name.toLowerCase()) {
                console.log(item)
                result = item;

                item.data.forEach(forecast => {
                    arrOfForecast.push(new Forecast(forecast.datetime, forecast.weather.description))
                })
            }
        });

        if (!result) {
            response.status(404).send('error no data found.');
        } else {
            response.status(200).send(arrOfForecast);
        }

    } else {
        response.status(200).send(weather)
    }
});

app.get('/search', (request, response) => {
    console.log()
    response.send('in progress')
})

app.get('/bad-request', (request, response) => {
    throw new Error('Testing Server Error')
})


app.use('*', (request, response) => {
    response.status(404).send('No data found')
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something went wrong')
});

app.listen(PORT, () => {
    console.log('App is running');
})