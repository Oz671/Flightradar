// change temp with database api
// var pullfromMongo = require('./dataset_mongodb.js');

// const { A } = require("bigml/lib/tssubmodels");

// var model = pullfromMongo.pullfromMongo()
// console.log(model);

async function saveDataToMongoDB() {
  try {
    console.log("Saving data in progress...");
    let response = await fetch('http://localhost:5501/allFlights/saveFlights');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
saveDataToMongoDB()
setInterval(saveDataToMongoDB, 60000 * 15);//44 min is 1000 pre month we put 15 because we need data asp!

let departure_temp = '0';
let latestWeather;
async function getFlightsCount(url) {
  try {
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
(async () => {
  const departureCount = await getFlightsCount(
    'http://localhost:5501/allFlights/countDep'
  );
  const arrivalCount = await getFlightsCount(
    'http://localhost:5501/allFlights/countArr'
  );
  document.getElementById('departure-text') != null
    ? (document.getElementById('departure-text').innerText = departureCount)
    : '';

  document.getElementById('arrival-text') != null
    ? (document.getElementById('arrival-text').innerText = arrivalCount)
    : '';
})
setInterval((async () => {
  const departureCount = await getFlightsCount(
    'http://localhost:5501/allFlights/countDep'
  );
  const arrivalCount = await getFlightsCount(
    'http://localhost:5501/allFlights/countArr'
  );
  document.getElementById('departure-text') != null
    ? (document.getElementById('departure-text').innerText = departureCount)
    : '';

  document.getElementById('arrival-text') != null
    ? (document.getElementById('arrival-text').innerText = arrivalCount)
    : '';
}),1000);
async function getLatestWeather() {
  try {
    let response = await fetch('http://localhost:5501/weather');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
async function saveLatestWeather() {
  try {
    let response = await fetch('http://localhost:5501/weather/save');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
// async function getLatestWeather(date) {
//   try {
//     let response = await fetch('http://localhost:5501/weather?:${date}');
//     response = await response.json();
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }
async function renderWeather() {
  save = await saveLatestWeather()
  latestWeather = await getLatestWeather();
  console.log('latestWeather', latestWeather);
  let temp_sign = '°';
  document.getElementById('temperature-text').innerHTML = latestWeather[0].temperature + temp_sign;
  if (latestWeather.status == 'Clouds') {
    document.getElementById('weather-icon').className = 'ph-cloud';
  } else if (latestWeather.status == 'Clear') {
    document.getElementById('weather-icon').className = 'ph-sun';
  } else if (latestWeather.status == 'Atmosphere') {
    document.getElementById('weather-icon').className = 'ph-cloud-fog';
  } else if (latestWeather.status == 'Snow') {
    document.getElementById('weather-icon').className = 'ph-snowflake';
  } else if (latestWeather.status == 'Drizzle') {
    document.getElementById('weather-icon').className = 'ph-drop-half';
  } else if (latestWeather.status == 'Thunderstorm') {
    document.getElementById('weather-icon').className = 'ph-cloud-lightning';
  }
}
renderWeather()
setInterval(renderWeather, 60000 * 15);
async function getDepartureFlights() {
  try {
    let response = await fetch('http://localhost:5501/allFlights/depFlights');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
async function getallFlights() {
  try {
    let response = await fetch('http://localhost:5501/allFlights');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getArrivalFlights() {
  try {
    let response = await fetch('http://localhost:5501/allFlights/arrFlights');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
(async () => {
  
  if (document.getElementById('list-of-dept-flights') != null) {
    let deptFlights = await getDepartureFlights();
    document.getElementById('gif').style.display = 'none';
    for (let i = 0; i < deptFlights.length; i++) {
      const distance = (deptFlights[i].duration <= 60 ) ?  (deptFlights[i].duration <= 210 ) ?  "SHORT": "MEDIUM" : "LONG";
      var delay = null;
      if(deptFlights[i].delay == null ){
        delay = "NO";
      }else if(deptFlights[i].delay <= 15){
        delay = "NO";
      }else if(deptFlights[i].delay <= 60){
        delay = "DELAY";
      }else{
        delay = "H.DELAY";
      }
      const terminal = deptFlights[i].dep_terminal;
      const gate = deptFlights[i].dep_gate;
      let new_flight =
        '\
            <div class="transfer">\
                <div class="transfer-logo">\
                    <img src="plane-departure-svgrepo-com.svg"/>\
                </div>\
                <dl class="transfer-details">\
                    <div>\
                        <dt>' + deptFlights[i].dep_icao + '</dt>\
                        <dd>Dep. Airport</dd>\
                    </div>\
                    <div>\
                        <dt>' + terminal + '</dt>\
                        <dd>Dep. Terminal</dd>\
                    </div>\
                    <div>\
                        <dt>' + gate + '</dt>\
                        <dd>Dep. Gate</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        deptFlights[i].dep_time +
                      '</dt>\
                        <dd>Dep. Date</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        deptFlights[i].arr_icao +
        '</dt>\
                        <dd>Arr. Airport</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        deptFlights[i].arr_time +
        '</dt>\
                        <dd>Arr. Date</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        deptFlights[i].flight_icao +
        '</dt>\
                        <dd>Fligh Number</dd>\
                    </div>\
                    <div>\
                    <dt>' +
                    distance +
        '</dt>\
                    <dd>Distance</dd>\
                    </div>\
                    <div>\
                    <dt>' +
        delay +
        '</dt>\
                    <dd>Delay</dd>\
                </div>\
                </dl>\
            </div>';
      
      document.getElementById('list-of-dept-flights').innerHTML += new_flight;
    }
  } else if (document.getElementById('list-of-arr-flights') != null) {
    let arrFlights = await getArrivalFlights();
    document.getElementById('gif').style.display = 'none';
    // departure_temp = latestWeather[0].temperature;
    for (let i = 0; i < arrFlights.length; i++) {
      const distance = (arrFlights[i].duration <= 60 ) ?  (arrFlights[i].duration <= 210 ) ?  "SHORT": "MEDIUM" : "LONG";
      var delay = null;
      if(arrFlights[i].delay == null ){
        delay = "NO";
      }else if(arrFlights[i].delay <= 15){
        delay = "NO";
      }else if(arrFlights[i].delay <= 60){
        delay = "DELAY";
      }else{
        delay = "H.DELAY";
      }      const terminal = (arrFlights[i].dep_terminal === null || arrFlights[i].dep_terminal === 'undefined') ? "No info": arrFlights[i].dep_terminal
      const gate = (arrFlights[i].dep_gate === null || arrFlights[i].dep_gate === 'undefined') ? "No info": arrFlights[i].dep_gate
      let new_flight =
        '\
            <div class="transfer">\
                <div class="transfer-logo">\
                    <img src="plane-arrival-svgrepo-com.svg"/>\
                </div>\
                <dl class="transfer-details">\
                    <div>\
                        <dt>' + arrFlights[i].dep_icao + '</dt>\
                        <dd>Dep. Airport</dd>\
                    </div>\
                    <div>\
                        <dt>' + terminal + '</dt>\
                        <dd>Dep. Terminal</dd>\
                    </div>\
                    <div>\
                        <dt>' + gate + '</dt>\
                        <dd>Dep. Gate</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        arrFlights[i].dep_time +
        '</dt>\
                        <dd>Dep. Date</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        arrFlights[i].arr_icao +
        '</dt>\
                        <dd>Arr. Airport</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        arrFlights[i].arr_time +
        '</dt>\
                        <dd>Arr. Date</dd>\
                    </div>\
                    <div>\
                        <dt>' +
                        arrFlights[i].flight_icao +
        '</dt>\
                        <dd>Fligh Number</dd>\
                    </div>\
                    <div>\
                    <dt>' +
                    distance +
        '</dt>\
                    <dd>Distance</dd>\
                    </div>\
                    <div>\
                    <dt>' +
                    delay +
        '</dt>\
                    <dd>Delay</dd>\
                </div>\
                </dl>\
            </div>';
      
      document.getElementById('list-of-arr-flights').innerHTML += new_flight;
    }
  } else if (document.getElementById('list-of-latest-flights') != null) {
    let arrFlights = await getallFlights();
    arrFlights = arrFlights.sort(
      (flight1, flight2) =>
        new Date(flight1.arr_time) - new Date(flight2.arr_time)
    );
    document.getElementById('gif').style.display = 'none';
    // departure_temp = latestWeather[0].temperature;
    for (let i = 0; i < arrFlights.length; i++) {
      console.log(arrFlights[i]);
      const imageURL = (arrFlights[i].arr_iata ===  "TLV") ? 'plane-arrival-svgrepo-com.svg' : 'plane-departure-svgrepo-com.svg';
      const distance = (arrFlights[i].duration <= 60 ) ?  (arrFlights[i].duration <= 210 ) ?  "SHORT": "MEDIUM" : "LONG";
      var delay = null;
      if(arrFlights[i].delay == null ){
        delay = "NO";
      }else if(arrFlights[i].delay <= 15){
        delay = "NO";
      }else if(arrFlights[i].delay <= 60){
        delay = "DELAY";
      }else{
        console.log(arrFlights[i].delay)
        delay = "H.DELAY";
      }      const terminal = (arrFlights[i].dep_terminal === null || arrFlights[i].dep_terminal === 'undefined') ? "No info": arrFlights[i].dep_terminal
      const gate = (arrFlights[i].dep_gate === null || arrFlights[i].dep_gate === 'undefined') ? "No info": arrFlights[i].dep_gate
      console.log(distance);
      let new_flight =
      '\
          <div class="transfer">\
              <div class="transfer-logo">\
                  <img src="'+ imageURL+'"/>\
              </div>\
              <dl class="transfer-details">\
                  <div>\
                      <dt>' + arrFlights[i].dep_iata + '</dt>\
                      <dd>Dep. Airport</dd>\
                  </div>\
                  <div>\
                      <dt>' +
                      arrFlights[i].dep_time +
      '</dt>\
                      <dd>Dep. Date</dd>\
                  </div>\
                  <div>\
                        <dt>' + terminal + '</dt>\
                        <dd>Dep. Terminal</dd>\
                    </div>\
                    <div>\
                        <dt>' + gate + '</dt>\
                        <dd>Dep. Gate</dd>\
                    </div>\
                  <div>\
                      <dt>' +
                        arrFlights[i].arr_iata +
                    '</dt>\
                      <dd>Arr. Airport</dd>\
                  </div>\
                  <div>\
                      <dt>' +
                      arrFlights[i].arr_time +
      '</dt>\
                      <dd>Arr. Date</dd>\
                  </div>\
                  <div>\
                      <dt>' +
                      arrFlights[i].flight_icao +
      '</dt>\
                      <dd>Fligh Number</dd>\
                  </div>\
                  <div>\
                      <dt>' +
      distance +
      '</dt>\
                      <dd> Distance</dd>\
                  </div>\
                  <div>\
                  <dt>' +
                  delay +
      '</dt>\
                  <dd>Delay</dd>\
              </div>\
              </dl>\
          </div>';
      document.getElementById('list-of-latest-flights').innerHTML += new_flight;
    }
  }
})();
