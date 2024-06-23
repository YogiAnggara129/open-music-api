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

const validateData = (payload, schema) => {
  const validationResult = schema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = {
  mapDBToModelSong,
  validateData,
};
