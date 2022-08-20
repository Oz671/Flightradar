const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://peleg122@gmail.com:8cyNhK47?p6Aw3(@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


var create_n_model = require('./create_newModel.js');


const mongodb = require("mongodb").MongoClient;
const fs = require("fs");

let url = `mongodb+srv://peleg122@gmail.com:8cyNhK47?p6Aw3(@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority`;
var f = []
var m = []


function pullfromMongo() {


  console.log('function one');

   mongodb.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;

      client
        .db("flights")
        .collection("infoPlane")
        .find({})
        .toArray((err, data) => {
          if (err) throw err;

          data.forEach(flight => {
            flight['items'].forEach(name_ => {
              m.push(name_['type'])
            })
            f.push(m)
            m = []
          });


          var lineArray = []
          f.forEach(function (f, index) {
            var line = f.join(",");
            lineArray.push(line);
          });
          var csvContent = lineArray.join("\n");

          fs.writeFile('./Associations.csv', csvContent, 'utf8', function (err) {
            if (err) {
              console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
              console.log('It\'s saved!');
              create_n_model.create_n_model();

            }
          });

          client.close();
          // console.log('It\'s saved!');
        });
    }
  );



    // console.log("end mon");


}



module.exports.pullfromMongo = pullfromMongo;


// pullfromMongo()