const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
