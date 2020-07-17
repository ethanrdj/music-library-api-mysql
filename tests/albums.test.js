/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Album } = require('../src/models');
const { Artist } = require('../src/models');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'First Album', year: 1958 }).then((album) =>
          album.setArtist(artist)
        ),
        Album.create({ name: 'Second Album', year: 1999 }).then((album) =>
          album.setArtist(artist)
        ),
        Album.create({
          name: 'Third Album',
          year: 2008,
        }).then((album) => album.setArtist(artist)),
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });

    describe('GET /albums', () => {
      it('gets all album records', (done) => {
        request(app)
          .get('/albums')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            done();
          });
      });
    });

    describe('GET /artists/${artist.id}/albums', () => {
      it('gets all album records of given artist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/albums`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((album) => {
              const expected = albums.find((a) => a.id === album.id);
              expect(album.name).to.equal(expected.name);
              expect(album.year).to.equal(expected.year);
            });
            done();
          });
      });

      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get(`/artists/12345/albums`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });

    describe('PATCH /artists/:artistId', () => {
      it('updates album year by using artist id', (done) => {
        const album = albums[0];
        request(app)
          .patch(`/artists/${artist.id}/albums`)
          .send({ year: 1959 })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum.year).to.equal(1959);
              done();
            });
          });
      });
      it('updates album name by using artist id', (done) => {
        const album = albums[0];
        request(app)
          .patch(`/artists/${artist.id}/albums`)
          .send({ name: 'What is an Album?' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum.name).to.equal('What is an Album?');
              done();
            });
          });
      });

      it('returns 404 if the artist does not exist', (done) => {
        request(app)
          .patch('/artists/12345/albums')
          .send({ year: 1959 })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    });

    describe('DELETE /artists/:artistId/albums/:albumId', () => {
      it('deletes albums using artist id and album id', (done) => {
        const album = albums[0];
        request(app)
          .delete(`/artists/${artist.id}/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Album.findByPk(album.id, { raw: true }).then((deletedAlbum) => {
              expect(deletedAlbum).to.equal(null);
              done();
            });
          });
      });

      it('returns a 404 if there is no artist', (done) => {
        request(app)
          .delete(`/artists/12345/albums/1}`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found');
            done();
          });
      });
    });
  });
});
