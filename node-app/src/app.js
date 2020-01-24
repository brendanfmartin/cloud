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
  const client = new Client({
    user: 'gis',
    host: 'localhost',
    database: 'gis',
    password: 'gis',
    port: 5432,
  });

  client.connect()
    .then(x => console.log('connected', x))
    .then(() => client.query('SELECT NOW()'))
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
