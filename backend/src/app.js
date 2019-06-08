const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const ExpressPeerServer = require('peer').ExpressPeerServer;

dotenv.config();

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(methodOverride());
app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  debug: true
};

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
  console.log('client connected');
  socket.on('stream', image => {
    socket.broadcast.emit('stream', image);
  });
});

const server = http.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log('Listening on port ' + port);
});

console.log('Peer server on!');

module.exports = app;
