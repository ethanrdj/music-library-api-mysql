const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');

const artistControllers = require('./controllers/artist');
const albumControllers = require('./controllers/album');

const app = express();

app.use(express.json());

// ARTIST

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.updateArtistById);

app.delete('/artists/:id', artistControllers.deleteArtist);

// ALBUMS

app.post('/artists/:artistId/albums', albumControllers.createsAlbum);

app.get('/albums', albumControllers.listAlbums);

app.get('/artists/:artistId/albums', albumControllers.getAlbumByArtistId);

app.patch('/artists/:artistId/albums', albumControllers.updateAlbum);

app.delete('/artists/:artistId/albums/:albumId', albumControllers.deleteAlbum);

module.exports = app;
