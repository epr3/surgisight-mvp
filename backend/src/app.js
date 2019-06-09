const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(methodOverride());
app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// ALWAYS USE ERROR MIDDLEWARE LAST !!!!
app.use(errorMiddleware);

const http = require('http').Server(app);
const io = require('socket.io')(http);

const PeerServer = require('peer').PeerServer;
const peerServerInstance = new PeerServer({
  port: 4000,
  path: '/peerjs',
  debug: 3
});

peerServerInstance.on('connection', function(id) {
  io.emit('user connected', id);
  console.log('User connected with #', id);
});

peerServerInstance.on('disconnect', function(id) {
  io.emit('user disconnected', id);
  console.log('With #', id, 'user disconnected.');
});

io.on('connection', socket => {
  socket.on('scene', data => {
    socket.broadcast.emit('scene:emit', data);
  });
  socket.on('tap', data => {
    io.sockets.emit('tap:emit', data);
  });
  socket.on('clear', () => {
    io.sockets.emit('clear:emit');
  });
});

const server = http.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log('Listening on port ' + port);
});

console.log('Peer server on!');

module.exports = app;
