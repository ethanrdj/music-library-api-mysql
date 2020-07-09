const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

const artistControllers = require('./controllers/artist')

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

module.exports = app;
