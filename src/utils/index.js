const mapDBToModelSong = (e) => ({
  id: e.id,
  title: e.title,
  year: e.year,
  genre: e.genre,
  performer: e.performer,
  duration: e.duration,
  albumId: e.album_id,
});

module.exports = {
  mapDBToModelSong,
};
