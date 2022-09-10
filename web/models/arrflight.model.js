const mongoose = require('mongoose');

const arrFlightSchema = mongoose.Schema({
  lat: {
    type: String,
    required: false,
  },
  lng: {
    type: String,
    required: false,
  },
  dep_time: {
    type: String,
    required: false,
  },
  dir: {
    type: String,
    required: false,
  },
  flight_icao: {
    type: String,
    required: false,
  },
  dep_icao: {
    type: String,
    required: false,
  },
  arr_icao: {
    type: String,
    required: false,
  },dir: {
    type: String,
    required: false,
  },
  arr_iata: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
});

const Arrival = mongoose.model('Arrival', arrFlightSchema);

module.exports = Arrival;
