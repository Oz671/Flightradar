const mongoose = require('mongoose');

const allFlightSchema = mongoose.Schema({
  flight_iata: {
    type: String,
    required: false,
  },
  flight_icao: {
    type: String,
    required: false,
    unique: true
  },
  dep_iata: {
    type: String,
    required: false,
  },
  dep_icao: {
    type: String,
    required: false,
  },
  dep_terminalsaveLatestWeather: {
    type: String,
    required: false,
  },
  dep_gate: {
    type: String,
    required: false,
  },
  dep_time: {
    type: String,
    required: false,
  },
  arr_iata: {
    type: String,
    required: false,
  },
  arr_icao: {
    type: String,
    required: false,
  },
  arr_time: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  delayed: {
    type: Number,
    required: false,
  },
});

const allFlights = mongoose.model('allFlights', allFlightSchema);

module.exports = allFlights;
