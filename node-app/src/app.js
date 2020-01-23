const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidv4 = require('uuid/v4');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * AMAZON STUFF
 */

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB();
const ddbGeo = require('dynamodb-geo');

const dbname = 'wheresStarbucks';

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, dbname);
config.hashKeyLength = 5;

const myGeoTableManager = new ddbGeo.GeoDataManager(config);

/**
 * END AMAZON STUFF
 */


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

let thoughts = [];

/**
 *  IF WE STORE THE COORDINATES OF THE THOUGHTS
 *
 *
 *  AND WE STORE THE COORDINATES OF THE VIEWPORTS
 *
 *
 *  CAN WE QUICKLY SEND TO THE SOCKETS
 *
 *
 *  WHERE THE SOCKET JOINED ROOM IS THE BINARY OF THE COORDS?
 */




io.on('connection', socket => {
  let previousId;
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
    previousId = currentId;
  };

  socket.on('getThought', thoughtId => {
    safeJoin(thoughtId);
    socket.emit('thought', thoughts[thoughtId]);
  });

  socket.on('addThought', thought => {
    thoughts[thought.id] = thought;
    safeJoin(thought.id);
    io.emit('thoughts', Object.keys(thoughts));
    socket.emit('thought', thought);
  });

  socket.on('editThought', thought => {
    thoughts[thought.id] = thought;
    socket.to(thought.id).emit('thought', thought);
  });

  io.emit('thoughts', Object.keys(thoughts));

  console.log(`Socket ${socket.id} has connected`);
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log('Listening on port', port);
});


app.get('/thoughts', (req, res) => {
  res.send(thoughts).end();
});

app.get('/thought/:id', (req, res) => {
  // const id = uuidv4();
  // thoughts.push(id, ...req.body);
  // res.json({message: 'accepted', thoughts}).end();
});

app.post('/thought', (req, res) => {
  const id = uuidv4();
  thoughts.push({id, ...req.body});
  res.json({message: 'accepted', thoughts}).end();
});

app.delete('/thoughts', (req, res) => {
  thoughts = [];
  res.json({message: 'deleted', thoughts}).end();
});

app.post('/coffee', (req, res) => {
  myGeoTableManager.queryRadius({
    RadiusInMeter: req.body.radius || 10000,
    CenterPoint: {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    },
  })
    .then((locations) => res.json(locations).end());
});

app.post('/thought/dynamo', (req, res) => {
  console.log(req.body);

  const b = req.body;

  const input = [{
    RangeKeyValue: { S: uuidv4() },
    GeoPoint: {
      latitude: b.position.coords.latitude,
      longitude: b.position.coords.longitude
    },
    PutItemInput: {
      Item: {
        thought: { S: b.thought },
        position: { M: b.position },
      },
    }
  }];

  myGeoTableManager.batchWritePoints(input)
    .promise()
    .then((res) => console.log(res))
    .then(() => res.json({ok: 'ok'}).end())
    .catch((error) => {
      console.error(error);
      res.status(500).json({error: 'error inserting'}).end()
    })
});
