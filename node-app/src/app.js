const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const thoughts = {};

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

http.listen(4444, () => {
  console.log('Listening on port 4444');
});
