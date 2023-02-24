'use strict'

require('dotenv').config();
const axios = require('axios');

const WEATHER_CLIENT_ID = process.env.WEATHER_API_KEY;

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
};

const getWeather = async (request, response) => {
    let arrOfForecast = [];

    let weatherProxy = {
        url: `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_CLIENT_ID}&city=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}`,
        method: 'GET'
    };

    let weatherProxyResult = await axios(weatherProxy);

    weatherProxyResult.data.data.forEach(dailyForecast => {
        arrOfForecast.push(new Forecast(dailyForecast.valid_date, dailyForecast.weather.description))
    })

    if (weatherProxyResult.data) {
        response.status(200).send(arrOfForecast);
    } else {
        response.status(404).send('data not found')
    }

}

module.exports = getWeather;