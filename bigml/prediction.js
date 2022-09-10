// require('events').EventEmitter.prototype._maxListeners = 70;
// require('events').defaultMaxListeners = 70;
var bigml = require('bigml');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://peleg:Peleg122@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const DB = client.db("flights");


const myAsyncFunction = async() => {
    const collection = await DB.collection("allflights"); // do this INSIDE async function
    const json = await collection.find().sort({_id:-1}).limit(200).project({  flight_iata:1,
        flight_icao:1,
        dep_iata:1,
        dep_icao:1,
        dep_terminal:1,
        dep_gate:1,
        dep_time:1,
        arr_iata:1,
        arr_icao:1,
        arr_time:1,
        status:1,
        duration:1});

        const results = json.toArray((err, result) => {
            if (err) throw err;
            var localModel = new bigml.LocalModel('model/631a3ff01ca2065cfd000dc1');
            result.forEach(line => {
                localModel.predict(line,
                    function(error, prediction) {
                        results.delayed = prediction.prediction;
                        console.log(prediction.prediction);
                        console.log(line);
              })
            });
            
    collection.insertMany(results,{ordered:false}); // similarly inside async
  }
)};
myAsyncFunction()
import Kafka from 'node-rdkafka';
import eventTypeFlightNumber  from '../eventType/eventTypeFlightNumber.js';
import axios  from 'axios';

process.env.CLOUDKARAFKA_BROKERS= "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094";
process.env.CLOUDKARAFKA_USERNAME="qr6jojg6"
process.env.CLOUDKARAFKA_PASSWORD="qR_PQnz8EhuaTFS25-OXPPV_JlDRYkBV"
// process.env.CLOUDKARAFKA_TOPIC_PREFIX="username"



var kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094",//.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "qr6jojg6",
  "sasl.password": "qR_PQnz8EhuaTFS25-OXPPV_JlDRYkBV",
  "debug": "generic,broker,security"
};

async function getAirportDetails({id}){
  const res =  await axios({
    method: "get",
    url:'http://localhost:3000/flight',
    params:{
      id
    }
  });
  //console.log('getAirportDetails res && res.data res.data.response', res && res.data && res.data.response)

  return res && res.data;
}

var consumer = new Kafka.KafkaConsumer(kafkaConf, {});

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..')
  consumer.subscribe([ 'qr6jojg6-default']);
  setInterval(function() {
    consumer.consume(1);
  }, 1000);
}).on('data', function(data) {
  console.log(`received message: ${eventTypeFlightNumber.fromBuffer(data.value)}`);
  const {id} = eventTypeFlightNumber.fromBuffer(data.value)
  getAirportDetails({id}).then(data => console.log(data));
});
  
//   client.close();

        
// client.connect(err => {
//   const collection = client.db("flights").collection("allflights");
//   const json = collection.find().sort({_id:-1}).limit(200).project({  flight_iata:1,
//     flight_icao:1,
//     dep_iata:1,
//     dep_icao:1,
//     dep_terminal:1,
//     dep_gate:1,
//     dep_time:1,
//     arr_iata:1,
//     arr_icao:1,
//     arr_time:1,
//     status:1,
//     duration:1});
//     const results = json.toArray((err, result) => {
//         if (err) throw err;
//         var localModel = new bigml.LocalModel('model/631a3ff01ca2065cfd000dc1');
//         result.forEach(line => {
//             localModel.predict(line,
//                 function(error, prediction) {
//                     line.delayed = prediction.prediction;
//                     console.log(prediction.prediction);
//                     console.log(line);
//                     collection.insertOne(line,{ordered:false})});
//           })
//         // var arr = JSON.parse(result);
//         // for(var i = 0; i < result.length; i++)
//         // {
//         //     localModel.predict(arr[i],
//         //         function(error, prediction) {
//         //             arr[i].delayed = prediction.prediction;
//         //             console.log(prediction.prediction);
//         //             console.log(arr[i]);
//         //             collection.insertOne(arr[i],{ordered:false})});
//         // }
    
//         client.close();

//     });        
// adds prediction into the mongodb for each flight
// });


// Downloads and generates a local version of the Model.
// var localModel = new bigml.LocalModel('model/631a3ff01ca2065cfd000dc1');

//     localModel.predict({
//                 flight_iata: 'WZ25',
//                 flight_icao: 'RWZ25',
//                 dep_iata: 'MRV',
//                 dep_icao: 'URMM',
//                 dep_gate: null,
//                 dep_time: '2022-09-11 05:40',
//                 arr_iata: 'TLV',
//                 arr_icao: 'LLBG',
//                 arr_time: '2022-09-11 09:20',
//                 status: 'scheduled',
//                 duration: 220
//               },
//                        function(error, prediction) {console.log(prediction)});
// var Model = new bigml.LocalModel(
//     'model/631a3ff01ca2065cfd000dc1', new bigml.BigML({ "domain": "bigml.io" }));


// async function get_prediction(input_Data, callback) {

//     var inputData = {
//         flight_iata: 'WZ25',
//         flight_icao: 'RWZ25',
//         dep_iata: 'MRV',
//         dep_icao: 'URMM',
//         dep_gate: null,
//         dep_time: '2022-09-11 05:40',
//         arr_iata: 'TLV',
//         arr_icao: 'LLBG',
//         arr_time: '2022-09-11 09:20',
//         status: 'scheduled',
//         duration: 220
//       };
    
//     var line = []

//     Model.predict(inputData,  await (async function (error, data) {
//         console.log(data);
//         // line.push(inputData.field1)
//         // for (let index2 = 0; index2 < data.length; index2++) {
//         //     line.push(data[index2].item.name)
//         //     line.push(data[index2].score)
//         // }
//         console.log("row")
//         callback(line)
//     }));
//  return line
// }


// module.exports = {
//     get_prediction: get_prediction
// };
// get_prediction();
// export BIGML_USERNAME=peleg122
// export BIGML_API_KEY=1f39a5d21267fcc396f96a27ac0f67ecae015533
// export BIGML_AUTH="username=$BIGML_USERNAME;api_key=$BIGML_API_KEY"