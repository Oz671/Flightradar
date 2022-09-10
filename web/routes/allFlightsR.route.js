const express = require('express');
const router = express.Router();
var moment = require('moment');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const allFlights = require('../models/allFlights.model');
const fetch = require('node-fetch');

async function getFlightData() {
  try {
    const response = await fetch(
      'https://airlabs.co/api/v9/schedules?api_key=e9db7795-f057-40a1-80cc-ac9a79b4be90&dep_iata=TLV&_fields=flight_iata,\
      flight_icao,\
      dep_iata,\
      dep_icao,\
      dep_terminal,\
      dep_gate,\
      dep_time,\
      arr_iata,\
      arr_icao,\
      arr_time,\
      status,\
      duration,\
      delayed'
    );
    const parsedJson = await response.json();
    const response2 = await fetch(
      'https://airlabs.co/api/v9/schedules?api_key=e9db7795-f057-40a1-80cc-ac9a79b4be90&arr_iata=TLV&_fields=flight_iata,flight_icao,dep_iata,dep_icao,dep_terminal,dep_gate,\
dep_time,arr_iata,arr_icao,arr_time,status,duration,delayed'
    );
    const parsedJson2 = await response2.json();
    const combined = parsedJson.response.concat(parsedJson2.response);
    return combined;
  } catch (error) {
    console.log(error);
  }
}
async function getLiveFlightData() {
  try {
    const response = await fetch(
      'https://airlabs.co/api/v9/flights?api_key=d445f8c4-a772-41c3-b215-d1249e350c21&flag=IL'
    );
    const parsedJson = await response.json();
    return parsedJson.response;
  } catch (error) {
    console.log(error);
  }
}
async function removePreviousData() {
  await allFlights.remove({});
}
async function saveFlightDataInDatabase() {
  try {
    // await removePreviousData();
    let flightData = await getFlightData();
    await allFlights.insertMany(flightData,{ordered : false });
    console.log('Flight data saved successfully');
  }
    catch (error) {
    console.log(error);
  }
}
async function getLateslFlights() {
  try {
    const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const nowCopy = new Date();
    const then = moment(nowCopy).subtract(90, "minutes").format("YYYY-MM-DD HH:mm");
    const response = await allFlights.find({
      dep_time:{
        $gte:then,
        $lte: now2
      }
    }).sort({ _id: 1 });
    return response;
  } catch (error) {
    console.log(error.result.result.insertedIds);
  }
}
async function getAllFlights() {
  try {
    const response = await allFlights.find({
    }).sort({ _id: 1 });
    return response;
  } catch (error) {
    console.log(error.result.result.insertedIds);
  }
}
async function getLateslDepFlights() {
    try {
      const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const nowCopy = new Date();
    const then = moment(nowCopy).subtract(15, "minutes").format("YYYY-MM-DD HH:mm");
    const response = await allFlights.find({
      dep_time:{
        $gte:then,
        $lte: now2
      },
      dep_iata: "TLV"
    }).sort({ _id: 1 });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async function getLateslArrFlights() {
    try {
      const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const nowCopy = new Date();
    const then = moment(nowCopy).subtract(15, "minutes").format("YYYY-MM-DD HH:mm");
    const response = await allFlights.find({
      arr_time:{
        $gte:then,
        $lte: now2
      },
      arr_iata: "TLV"
    }).sort({ _id: 1 });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

router.get('/depFlights', async function (req, res) {
  try {
    const flights = await getLateslDepFlights();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});
router.get('/', async function (req, res) {
    try {
      console.log("here");
      const flights = await getLateslFlights();
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });
router.get('/arrFlights', async function (req, res) {
    try {
      const flights = await getLateslArrFlights();
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });
  router.get('/liveFlights', async function (req, res) {
    try {
      const flights = await getLiveFlightData();
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });
  router.get('/bigmlFlights', async function (req, res) {
    try {
      const flights = await getAllFlights();
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });

router.get('/saveFlights', async function (req, res) {
    try {
      await saveFlightDataInDatabase();
      res.status(200).json({ok:"Data Saved!"});
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });
  

router.get('/countArr', async function (req, res) {
  try {
    const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const nowCopy = new Date();
    const then = moment(nowCopy).subtract(15, "minutes").format("YYYY-MM-DD HH:mm");
    const arrivalFlights = await allFlights.find({
      arr_time:{
        $gte:then,
        $lte: now2
      },
      arr_iata: "TLV"
    }).countDocuments();
    res.status(200).json(arrivalFlights);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

router.get('/countDep', async function (req, res) {
    try {
      const now = new Date();
    const now2 = moment(now).format("YYYY-MM-DD HH:mm");
    const nowCopy = new Date();
    const then = moment(nowCopy).subtract(15, "minutes").format("YYYY-MM-DD HH:mm");
    const departureFlights = await allFlights.find({
      dep_time:{
        $gte:then,
        $lte: now2
      },
      dep_iata: "TLV"
    }).countDocuments();
      res.status(200).json(departureFlights);
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  });

module.exports = router;
