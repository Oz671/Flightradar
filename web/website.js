const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const weatherRoutes = require('./routes/weather.route');
// const DeptRoutes = require('./routes/departureFlights.route');
// const ArrRoutes = require('./routes/arrivalFlights.route');
const AllRoutes = require('./routes/allFlightsR.route.js');
mongoose
  .connect('mongodb+srv://peleg:Peleg122@bigmlproj.ix0tuj9.mongodb.net/flights?retryWrites=true&w=majority')
  .then((success) => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use('/', express.static(path.join(__dirname + '/')));
app.use('/weather', weatherRoutes);
// app.use('/deptFlights', DeptRoutes);
// app.use('/arrFlights', ArrRoutes);
app.use('/allFlights', AllRoutes);
app.listen(5501, () => console.log('Server is listening on port 5501'));
