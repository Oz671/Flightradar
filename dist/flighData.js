// const axios = require('axios');
// const params = {
//   access_key: '4f712c2869783dc7da182f65e65579dd',
//   arr_icao:'LLBG',
//   dep_icao:'LLBG'
// }

// axios.get('https://api.aviationstack.com/v1/flights', {params})
//   .then(response => {
//     const apiResponse = response.data;
//     if (Array.isArray(apiResponse['results'])) {
//         apiResponse['results'].forEach(flight => {
//             if (!flight['live']['is_ground']) {
//                 console.log(`${flight['airline']['name']} flight ${flight['flight']['iata']}`,
//                     `from ${flight['departure']['airport']} (${flight['departure']['iata']})`,
//                     `to ${flight['arrival']['airport']} (${flight['arrival']['iata']}) is in the air.`);
//             }
//         });
//     }
//   }).catch(error => {
//     console.log(error);
//   });

const fs = require('fs')
var redis = require('redis');
var publisher = redis.createClient();


function getTable() {
    console.log('function three');
    var JS = fs.readFileSync(__dirname + '/dataset.json', 'utf8');
    var jsonString = JSON.parse(JS);
    var items = jsonString['object']['associations']['items'];

    if (jsonString['object']['associations']['rules'] !== undefined) {

        jsonString['object']['associations']['rules'].forEach(row => {
            var lhs = row['lhs'][0]
            row['lhs'] = items[lhs]['name']
            var rhs = row['rhs'][0]
            row['rhs'] = items[rhs]['name']
        });
        jsonString = jsonString['object']['associations']['rules'];
    }
    console.log("get table done!");
    publisher.publish("table", JSON.stringify(jsonString), function () {

    });


    return jsonString;

}



module.exports.getTable = getTable;