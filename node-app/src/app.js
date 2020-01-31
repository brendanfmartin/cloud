const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidv4 = require('uuid/v4');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const { Client } = require('pg');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(requestIp.mw());

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
 *
 *
 *
 *  user inits map
 *
 *  send geo spacial to ... redis
 *
 *  the message
 *  send msg-geo to redis
 *
 *  to find a message select * in an area
 *
 *
 *  given a point, can we select all squares that encompass it?
 *  if so, thats the rooms/sockets we send the pub too
 *
 *
 */

/**
 * TODO - BUILD A COMMON LAT LONG DICTIONARY
 *
 *  leaflet
 *  {"_southWest":{"lat":40.03270782042911,"lng":-75.36535263061525},"_northEast":{"lat":40.054391515684486,"lng":-75.34767150878908}}
 *  navigator.geoposition
 *  {"timestamp":1580401116551,"coords":{"accuracy":20,"altitude":null,"altitudeAccuracy":null,"heading":null,"latitude":40.0435483,"longitude":-75.3565279,"speed":null}}
 *
 */

/**
 * helpful documentation
 *
 * move to readme
 *
 *
 * socket.emit('message', "this is a test"); //sending to sender-client only
 * socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
 * socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
 * socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
 * socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
 * io.emit('message', "this is a test"); //sending to all clients, include sender
 * io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
 * io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
 * socket.emit(); //send to all connected clients
 * socket.broadcast.emit(); //send to all connected clients except the one that sent the message
 * socket.on(); //event listener, can be called on client to execute on server
 * io.sockets.socket(); //for emiting to specific clients
 * io.sockets.emit(); //send to all connected clients (same as socket.emit)
 * io.sockets.on() ; //initial connection from a client.
 *
 * https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit
 */


let thoughts = [];
let channels = [];

let connectPromise = undefined;

const connect = () => {
  if (connectPromise) {
    return connectPromise;
  } else {
    connectPromise = client.connect();
    return connectPromise;
  }
};

// todo - how do this? process.env? secure ssm params in a kms?
const client = new Client({
  user: 'gis',
  host: 'localhost',
  database: 'gis',
  password: 'gis',
  port: 5432,
});

const userGeoQuery = `SELECT CONCAT('SRID=4326;', ST_AsText( ST_MakeEnvelope($1, $2, $3, $4, 4326) )):: geography;`;
const getUserGeo = (location) => {
  connect()
    .then(x => console.log('connected'))
    .then(() => client.query(userGeoQuery, [location._southWest.lat, location._southWest.lng, location._northEast.lat, location._northEast.lng]))
    .then(r => console.log(r.rows[0]))
    .catch((err) => {
      console.error(err);
      res.status(500).json({err}).end();
    });
};


/**
 * think about this as one per connection
 */
io.on('connection', socket => {

  /**
   * stores reference to the current room
   */
  let currentId;

  /**
   * store the
   * @param nextId <string>
   */
  const safeJoin = (nextId) => {
    // leave channel
    socket.leave(currentId);

    // remove channelId from list
    channels = channels.filter(c => c !== currentId);

    // join channel
    socket.join(nextId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));

    // add channelId to list
    channels.push(nextId);

    // assign currentId
    currentId = nextId;
  };

  socket.on('setLocation', (location) => {
    console.log(location);
    console.log(JSON.parse(location)._southWest.lat);
    // {"_southWest":{"lat":40.03270782042911,"lng":-75.36535263061525},"_northEast":{"lat":40.054391515684486,"lng":-75.34767150878908}}
    getUserGeo(JSON.parse(location));
    safeJoin(location);
    socket.emit('locationSet', location);
  });

  socket.on('getThought', (id) => {
    console.log('getthing thought with id', id);
    socket.emit('thought', thoughts[id]);
  });

  socket.on('addThought', thought => {
    // todo - get the location
    // thoughts[thought.id] = thought;
    // io  vs socket emit
    io.emit('thoughts', Object.keys(thoughts));
    socket.emit('thought', thought);
  });

  io.emit('thoughts', Object.keys(thoughts));

  io.on('error', (e) => console.error(e));

  console.log(`Socket ${socket.id} has connected`);
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log('Listening on port', port);
});


app.get('/thoughts', (req, res) => {
  const ip = req.clientIp;
  console.log(ip);
  res.send(thoughts).end();
});

app.get('/thought/:id', (req, res) => {
  // const id = uuidv4();
  // thoughts.push(id, ...req.body);
  // res.json({message: 'accepted', thoughts}).end();
});

app.get('/db', async (req, res) => {
  connect()
    .then(x => console.log('connected', x))
    .then(() => client.query('SELECT * from information_schema.tables'))
    .then(r => res.json({r}).end())
    .catch((err) => {
      console.error(err);
      res.status(500).json({err}).end();
    });

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
