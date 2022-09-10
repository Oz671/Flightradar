const express = require('express');
const router = express.Router();
const Departure = require('../models/deptflight.model');
const fetch = require('node-fetch');

async function getFlightData() {
  try {
    const response = await fetch(
      'https://airlabs.co/api/v9/flights?api_key=8cdab4fb-0904-4c15-bd97-2dc04401b3e5&dep_iata=TLV'
    );
    const parsedJson = await response.json();
    return parsedJson.response;
  } catch (error) {
    console.log(error);
  }
}
async function removePreviousData() {
  await Departure.remove({});
}
async function saveFlightDataInDatabase() {
  try {
    // await removePreviousData();
    let flightData = await getFlightData();
    for (let i = 0; i < flightData.length; i++) {
      await Departure.create({
        lat: flightData[i].lat,
        lng: flightData[i].lng,
        dir: flightData[i].dir,
        flight_icao: flightData[i].flight_icao,
        dep_icao: flightData[i].dep_icao,
        dep_iata: flightData[i].dep_iata,
        arr_icao: flightData[i].arr_icao,
        arr_iata: flightData[i].arr_iata,
        // date: new Date(Date.now()),
        dep_terminal: flightData[i].dep_terminal,
        dep_time: Date(flightData[i].dep_time),
        airline_iata: flightData[i].airline_iata,
        arr_iata: flightData[i].arr_iata,
      });
      console.log('Flight data saved successfully');
    }
  } catch (error) {
    console.log(error);
  }
}
async function getLatestDepartureFlights() {
  try {
    const response = await Departure.find({
    //     dep_time: {
    //       $gte: new Date( Date.now() - 1000 * 60 * 15 ), 
    //       $lt: new Date.now()
    //   }
    
  
    }).sort({ _id: 1 });
    return response;
  } catch (error) {
    console.log(error);
  }
}

router.get('/', async function (req, res) {
  try {
    await saveFlightDataInDatabase();
    const flights = await getLatestDepartureFlights();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});
router.get('/count', async function (req, res) {
  try {
    const departureFlights = await Departure.find({}).countDocuments();
    res.status(200).json(departureFlights);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

module.exports = router;
