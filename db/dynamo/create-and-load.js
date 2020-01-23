
// Boilerplate provided by https://www.npmjs.com/package/dynamodb-geo

/* A hashKeyLength of 5 is ideal for searches with a 10km granuality,
   according to the tests in the NPM documentation - jbesw

   In LoadTable, you can adjust BATCH_SIZE and WAIT_BETWEEN_BATCHES_MS to
   slow down the load if you don't want to burn through write capacity. */

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB();
const ddbGeo = require('dynamodb-geo');

const dbname = 'wheresStarbucks';

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, dbname);
config.hashKeyLength = 5;

const myGeoTableManager = new ddbGeo.GeoDataManager(config);
// For random numbers
const uuid = require('uuid');

const setupTable = () => {
  // Use GeoTableUtil to help construct a CreateTableInput.
  const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

  // Tweak the schema as desired
  createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5;

  console.log('Creating table with schema:');
  console.dir(createTableInput, { depth: null });

  // Create the table
  ddb.createTable(createTableInput).promise()
  // Wait for it to become ready
    .then(() => ddb.waitFor('tableExists', { TableName: config.tableName }).promise())
    .then(() => {
      console.log('Table created and ready!');
      console.log('Running load script');
      loadTable();
    });
};

// Mostly taken from:
// https://github.com/rh389/dynamodb-geo.js/blob/master/example/index.js

const loadTable = () => {
  const data = require('./data/startbucks_us_locations');

  const putPointInputs = data.map((location) => ({
    RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
    GeoPoint: {
      latitude: location.position.lat,
      longitude: location.position.lng,
    },
    PutItemInput: {
      Item: {
        name: { S: location.name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
        address: { S: location.address },
      },
    },
  }));

  const BATCH_SIZE = 25;
  const WAIT_BETWEEN_BATCHES_MS = 1000; // << LOOK!
  let currentBatch = 1;

  function resumeWriting() {
    if (putPointInputs.length === 0) {
      return Promise.resolve();
    }
    const thisBatch = [];
    for (let i = 0, itemToAdd = null; i < BATCH_SIZE && (itemToAdd = putPointInputs.shift()); i++) {
      thisBatch.push(itemToAdd);
    }
    console.log(`Writing batch ${currentBatch++}/${Math.ceil(data.length / BATCH_SIZE)}`);

    return myGeoTableManager.batchWritePoints(thisBatch).promise()
      .then(() => new Promise(((resolve) => {
        setInterval(resolve, WAIT_BETWEEN_BATCHES_MS);
      })))
      .then(() => resumeWriting());
  }

  return resumeWriting().catch((error) => {
    console.warn(error);
  });
};

// For tutorial purposes, run this first and then change to loadTable and run again.
setupTable();
