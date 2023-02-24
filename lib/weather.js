'use strict'

require('dotenv').config();
const axios = require('axios');

let cache = require('./cache');

const WEATHER_CLIENT_ID = process.env.WEATHER_API_KEY;

class Weather {
    constructor(date, description, maxTemp, minTemp, icon) {
        this.date = date,
            this.description = description,
            this.maxTemp = maxTemp,
            this.minTemp = minTemp,
            this.icon = `https://www.weatherbit.io/static/img/icons/${icon}.png`
    }
};

function getWeather(cityName, lat, lon) {
    const key = `weather-${lat}${lon}`;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_CLIENT_ID}&city=${cityName}&lat=${lat}&lon=${lon}&days=7`

    if (cache[key] && (Date.now() - cache[key].timestamp < 1000000)) {
        console.log('cache hit')
        console.log(cache[key])
    } else {
        console.log('cache miss')
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = axios.get(url)
            .then(response => parseWeather(response.data))
    }

    return cache[key].data;
};

function parseWeather(weatherData) {
    try {
        const weatherSummaries = weatherData.data.map(day => {
            return new Weather(
                day.valid_date,
                day.weather.description,
                day.max_temp,
                day.min_temp,
                day.weather.icon)
        });
        return Promise.resolve(weatherSummaries);
    } catch (e) {
        return Promise.reject(e)
    }
};

// const getWeather = async (request, response) => {
//     let arrOfForecast = [];

//     let weatherProxy = {
//         url: `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_CLIENT_ID}&days=7&city=${request.query.city_name}&lat=${request.query.lat}&lon=${request.query.lon}`,
//         method: 'GET'
//     };

//     let weatherProxyResult = await axios(weatherProxy);

//     console.log(weatherProxyResult)

//     weatherProxyResult.data.data.forEach(dailyForecast => {
//         arrOfForecast.push(new Forecast(
//             dailyForecast.valid_date,
//             dailyForecast.weather.description,
//             dailyForecast.max_temp,
//             dailyForecast.min_temp,
//             dailyForecast.weather.icon))
//     })

//     if (weatherProxyResult.data) {
//         response.status(200).send(arrOfForecast);
//     } else {
//         response.status(404).send('data not found')
//     }

// }

module.exports = getWeather;