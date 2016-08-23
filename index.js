const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

// db setup
mongoose.connect('mongodb://localhost:auth/auth');

// app setup
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// server setup
const port = process.env.PORT || 3000;

// forward http requests to express app
const server = http.createServer(app);
server.listen(port);
console.log('listening on port: ' + port);