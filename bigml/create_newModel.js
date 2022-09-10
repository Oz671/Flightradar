var bigml = require('bigml');
var fs = require('fs');


var getTable = require('./flightsData');


var connection = new bigml.BigML()
var source = new bigml.Source(connection);

function create_n_model() {
  console.log('function two');

  source.create('./Flights.csv', function (error, sourceInfo) {
    if (!error && sourceInfo) {
      var dataset = new bigml.Dataset(connection);
      dataset.create(sourceInfo, function (error, datasetInfo) {
        if (!error && datasetInfo) {
          var model = new bigml.Model(connection);
          model.create(datasetInfo, function (error, modelInfo) {
            if (!error && modelInfo) {
              console.log(modelInfo)
              var model = new bigml.Model(connection);
              model.get(modelInfo.resource,
                true,
                'only_model=true;limit=-1',
                function (error, resource) {
                  if (!error && resource) {
                    fs.writeFileSync('./dataset.json', JSON.stringify(resource));
                    console.log('datajson done!');
                    getTable.getTable();
                  }
                })
            }
          });
        }
      });
    }
  });
}

module.exports.create_n_model = create_n_model;