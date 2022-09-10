const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://peleg:Peleg122@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var create_n_model = require('./create_newModel.js');
const fetch = require('node-fetch');
const converter = require('json-2-csv');

async function getAllFlights() {
  try {
    let response = await fetch('http://localhost:5501/allFlights/bigmlFlights');
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}

const mongodb = require("mongodb").MongoClient;
const fs = require("fs");

let url = `mongodb+srv://peleg:Peleg122@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority`;

// async function convertToCSV(arr) {
//   const array = [Object.keys(arr[0])].concat(arr)

//   return array.map(it => {
//     return Object.values(it).toString()
//   }).join('\n')
// }

function ConvertToCSV(objArray) {
  console.log(objArray);
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  var line = Object.keys(objArray[Object.keys(objArray)[0]]).join(","); // Header columns.
  line += "\n";
  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}
function convertToCSV2(arr) {
  for(var i =0; i < arr.length; i++){
    delete arr[i]._v;
    if(arr[i].delayed === null){
      arr[i].delayed = 0
    }
  }
  const array = [Object.keys(arr[0])].concat(arr)

  return array.map(it => {
    return Object.values(it).toString()
  }).join('\n')
}
async function pullfromMongo() {
  


  console.log('function one');

  var csvContent = await getAllFlights();
  console.log(csvContent);
  // var jsonObject = JSON.stringify(csvContent);
  var csv = convertToCSV2(csvContent);
  console.log(csv);
  fs.writeFile('./Flights.csv', csv, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
      console.log('It\'s saved!');
      create_n_model.create_n_model();

    }
  });

}



(async() => {
  console.log('1')
  await pullfromMongo()  
  console.log('2')
})()

module.exports.pullfromMongo = pullfromMongo;
// fetch('http://localhost:5501/allFlights')
//     .then(res => res.text())
//     .then(text => (text, (err, csv) => {
//       if (err) {
//           throw err;
//       }
  
//       // print CSV string
//       console.log(text);
//       console.log(csv);
  
//       // write CSV to a file
//       fs.writeFileSync('./Flights.csv', , 'utf8');
      
//   }));

