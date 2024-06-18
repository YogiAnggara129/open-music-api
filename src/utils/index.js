const mapDBToModelSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelSongDetail = (e) => ({
  id: e.id,
  title: e.title,
  year: e.year,
  genre: e.genre,
  performer: e.performer,
  duration: e.duration,
  albumId: e.album_id,
});

const mapDBToModelAlbum = ({
  id, name, year, songs,
}) => ({
  id,
  name,
  year,
  songs: songs.map(mapDBToModelSongDetail),
});

const Logger = {
  log: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message);
    }
  },
  error: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`ERROR: ${message}`);
    }
  },
};

module.exports = {
  mapDBToModelAlbum,
  mapDBToModelSong,
  mapDBToModelSongDetail,
  Logger,
};
