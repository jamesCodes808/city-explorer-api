'use strict'

require('dotenv').config();
const axios = require('axios');

const WEATHER_CLIENT_ID = process.env.WEATHER_API_KEY;

class Forecast {
    constructor(date, description, maxTemp, minTemp, icon) {
        this.date = date,
            this.description = description,
            this.maxTemp = maxTemp,
            this.minTemp = minTemp,
            this.icon = `https://www.weatherbit.io/static/img/icons/${icon}.png`
    }
};

const getWeather = async (request, response) => {
    let arrOfForecast = [];

    let weatherProxy = {
        url: `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_CLIENT_ID}&days=7&city=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}`,
        method: 'GET'
    };

    let weatherProxyResult = await axios(weatherProxy);

    console.log(weatherProxyResult)

    weatherProxyResult.data.data.forEach(dailyForecast => {
        arrOfForecast.push(new Forecast(dailyForecast.valid_date, dailyForecast.weather.description, dailyForecast.max_temp, dailyForecast.min_temp, dailyForecast.weather.icon))
    })

    if (weatherProxyResult.data) {
        response.status(200).send(arrOfForecast);
    } else {
        response.status(404).send('data not found')
    }

}

module.exports = getWeather;