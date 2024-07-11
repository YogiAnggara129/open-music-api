const InvariantError = require('../exceptions/InvariantError');

const mapDBToModelSong = (e) => ({
  id: e.id,
  title: e.title,
  year: e.year,
  genre: e.genre,
  performer: e.performer,
  duration: e.duration,
  albumId: e.album_id,
});

const mapDBToModelAlbum = (e) => ({
  id: e.id,
  name: e.name,
  year: e.year,
  cover: `http://${process.env.HOST_API}:${process.env.PORT_API}/albums/covers/${e.cover}`,
});

const validateData = (payload, schema) => {
  const validationResult = schema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

const PlaylistRole = {
  owner: 'owner',
  collaborator: 'collaborator',
};

module.exports = {
  mapDBToModelSong,
  mapDBToModelAlbum,
  validateData,
  PlaylistRole,
};
