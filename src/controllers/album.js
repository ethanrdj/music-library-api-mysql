const { Artist } = require('../models');
const { Album } = require('../models');

exports.createsAlbum = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.create(req.body).then((createAlbum) => {
        createAlbum.setArtist(artist).then((album) => {
          res.status(201).json(album);
        });
      });
    }
  });
};

exports.listAlbums = (req, res) => {
  Album.findAll().then((albums) => {
    res.status(200).json(albums);
  });
};

exports.getAlbumByArtistId = (req, res) => {
  const { artistId } = req.params;
  Artist.findByPk(artistId).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.findAll({ where: { artistId: foundArtist.id } }).then((albums) => {
        res.status(200).json(albums);
      });
    }
  });
};

exports.updateAlbum = (req, res) => {
  const { artistId } = req.params;
  Artist.findByPk(artistId).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.update(req.body, { where: { artistId: foundArtist.id } }).then(
        (updatedAlbum) => {
          res.status(200).json(updatedAlbum);
        }
      );
    }
  });
};

exports.deleteAlbum = (req, res) => {
  const artistId = req.params.artistId;
  const albumId = req.params.albumId;
  Artist.findByPk(artistId).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found' });
    } else {
      Album.destroy({ where: { id: albumId, artistId: artistId } }).then(
        (albums) => {
          res.status(204).json(albums);
        }
      );
    }
  });
};
