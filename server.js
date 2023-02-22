'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.get('/weather', (request, response) => {
    console.log(request.url)
    response.status(200).send('works')
});

app.get('/bad-request', (request, response) => {
    let result = null;

    if (request.query.name) {
        weather.forEach(item => {
            if (item.name.toLowerCase() === request.query.name.toLowerCase()) {
                result = item;
            }
        });

        if (!result) {
            response.status(404).send('error no data found.');
        } else {
            response.status(200).send(result);
        }
    } else {
        response.status(200).send(weather)
    }
});

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