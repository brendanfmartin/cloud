const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB();
const ddbGeo = require('dynamodb-geo');

const dbname = 'wheresStarbucks';

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, dbname);
config.hashKeyLength = 5;

const myGeoTableManager = new ddbGeo.GeoDataManager(config);

myGeoTableManager.queryRadius({
  RadiusInMeter: 1000,
  CenterPoint: {
    latitude: 40.7769099,
    longitude: -73.9822532,
  },
})
  .then((locations) => console.log(locations));
