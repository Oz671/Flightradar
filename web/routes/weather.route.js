const express = require('express');
const router = express.Router();
var moment = require('moment');
const Weather = require('../models/weather.model');
const fetch = require('node-fetch');

async function getWeather() {
  let url = '';
  try {
    const response = await fetch(
      'http://api.openweathermap.org/data/2.5/weather?id=294421&appid=d9cb5ce31d5e2c4a4874388b55a78972&units=metric'
    );
    const parsedJson = await response.json();
    return [parsedJson['main']['temp'], parsedJson['weather'][0]['main']];
  } catch (error) {
    console.log(error);
  }
}
async function saveWeatherInDatabase() {
  try {
    let weather = await getWeather();
    let temperature = weather[0];
    let status = weather[1];
    const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const response = await Weather.create({ temperature:temperature, status:status, date:now2 });
    console.log('weather saved', response);
  } catch (error) {
    console.log(error);
  }
}
async function getLatestWeather() {
  try {
    const response = await Weather.find({}).sort({ _id: -1 }).limit(1);
    return response;
  } catch (error) {
    console.log(error);
  }
}
// async function getLatestWeather(date) {
//   try {
//     const response = await Weather.find({date: date}).sort({ _id: -1 }).limit(1);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }

router.get('/', async function (req, res) {
  try {
    const weather = await getLatestWeather();
    res.status(200).json(weather);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});
router.get('/save', async function (req, res) {
  try {
    await saveWeatherInDatabase();
    // const weather = await getLatestWeather();
    res.status(200).json({ok: "ok"});
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

router.get('/:date', async function (req, res) {
  try {
    const weather = await getLatestWeather(req.params.date);
    res.status(200).json(weather);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

module.exports = router;
