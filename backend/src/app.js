const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
require('./config/bookshelf');
require('./models');

const sessionRoutes = require('./routes/session');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(methodOverride());
app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dir = path.join(__dirname, '..', 'uploads');
app.use(express.static(dir));

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/video');

app.use(sessionRoutes);

// ALWAYS USE ERROR MIDDLEWARE LAST !!!!
app.use(errorMiddleware);

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('client connected');
  socket.on('stream', image => {
    socket.broadcast.emit('stream', image);
  });
});

if (process.env.NODE_ENV !== 'TEST') {
  const server = http.listen(process.env.PORT || 3000, () => {
    const { port } = server.address();
    console.log('Listening on port ' + port);
  });
}

module.exports = app;
