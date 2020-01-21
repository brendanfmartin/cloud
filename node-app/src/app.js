const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
var path = require('path');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/ui'));


let thoughts = {};

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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('./ui/index.html').end();
});


app.get('/thoughts', (req, res) => {
  res.send(thoughts).end();
});

app.post('/post-test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

app.post('/thought', (req, res) => {
  console.log(req);
  const thoughtId = uuidv4();
  thoughts[thoughtId] = req.body;
  res.json({message: 'accepted', thoughts}).end();
});

app.delete('/thoughts', (req, res) => {
  thoughts = {};
  res.json({message: 'deleted', thoughts}).end();
});
