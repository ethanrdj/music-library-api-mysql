const { Artist } = require('../models');
const { Album } = require('../models');
const { Song } = require('../models');

exports.createsSong = (req, res) => {
  const { albumId } = req.params;
  Album.findByPk(albumId).then((album) => {
    Song.create(req.body).then((createSong) => {
      createSong.setAlbum(album).then((song) => {
        song.setArtist(album.artistId).then((finalSong) => {
          res.status(201).json(finalSong);
        });
      });
    });
  });
};
