const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewPlaylist({ name, owner }) {
    const query = 'SELECT name FROM playlists WHERE name = $1 AND owner = $2';
    const result = await this._pool.query(query, [name, owner]);

    if (result.rows.length > 0) {
      throw new InvariantError('Playlist telah digunakan');
    }
  }

  async verifyPlaylistAvailableById({ id, owner }) {
    const query = 'SELECT id FROM playlists WHERE id = $1 AND owner = $2';
    const result = await this._pool.query(query, [id, owner]);

    if (result.rows.length === 0) {
      throw new InvariantError('Playlist tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async verifyNewPlaylistSongs({ id, songId }) {
    const query = 'SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
    const result = await this._pool.query(query, [id, songId]);

    if (result.rows.length > 0) {
      throw new InvariantError('Lagu sudah ditambahkan ke playlist');
    }
  }

  async addPlaylist({ name, owner }) {
    await this.verifyNewPlaylist({ name, owner });

    const id = `playlist-${nanoid(16)}`;
    const query = 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id';
    const result = await this._pool.query(query, [id, name, owner]);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists({ owner }) {
    const query = 'SELECT id, name FROM playlists WHERE owner = $1';
    const result = await this._pool.query(query, [owner]);

    return result.rows;
  }

  async deletePlaylistById({ id, owner }) {
    const query = 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id';
    const result = await this._pool.query(query, [id, owner]);

    if (result.rows.length === 0) {
      throw new InvariantError('Playlist gagal dihapus');
    }
  }

  async postPlaylistSongsById({ id, songId, owner }) {
    await Promise.all([
      this.verifyPlaylistAvailableById({ id, owner }),
      this.verifyNewPlaylistSongs({ id, songId }),
    ]);
    const query = 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id';
    const psId = `playlist_song-${nanoid(16)}`;
    const result = await this._pool.query(query, [psId, id, songId]);

    if (result.rows.length === 0) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getPlaylistSongsById({ id, owner }) {
    const playlistQuery = 'SELECT id, name FROM playlists WHERE id = $1 AND owner = $2';
    const playlistResultAsync = this._pool.query(playlistQuery, [id, owner]);

    const songsQuery = `
    SELECT * FROM songs s
    JOIN playlist_songs ps ON s.id = ps.song_id
    WHERE ps.playlist_id = $1`;
    const songsResultAsync = this._pool.query(songsQuery, [id]);

    const [playlistResult, songsResult] = await Promise.all([
      playlistResultAsync,
      songsResultAsync,
    ]);

    if (playlistResult.rows.length === 0) {
      throw new InvariantError('Playlist tidak ditemukan');
    }

    return { ...playlistResult.rows[0], songs: songsResult.rows };
  }

  async deletePlaylistSongsById({ id, songId, owner }) {
    await this.verifyPlaylistAvailableById({ id, owner });
    const query = 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id';
    const result = await this._pool.query(query, [id, songId]);

    if (result.rows.length === 0) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistsService;
