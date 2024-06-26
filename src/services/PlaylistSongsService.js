const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewPlaylistSongs({ id, songId }) {
    const query = 'SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
    const result = await this._pool.query(query, [id, songId]);

    if (result.rows.length > 0) {
      throw new InvariantError('Lagu sudah ditambahkan ke playlist');
    }
  }

  async _recordActivity({
    id, songId, userId, action, actionFunc,
  }) {
    const client = await this._pool.connect();

    try {
      const result = await actionFunc({ thisSpec: this, client });

      const psaId = `playlist_song_activity-${nanoid(16)}`;
      const psaQuery = 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action) VALUES ($1, $2, $3, $4, $5) RETURNING id';
      const psaResult = await client.query(psaQuery, [psaId, id, songId, userId, action]);

      if (psaResult.rows.length === 0) {
        throw new InvariantError('Lagu gagal ditambahkan ke playlist');
      }
      await client.query('COMMIT');

      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      if (e instanceof ClientError) {
        throw e;
      }
      throw new InvariantError('Terjadi kesalahan pada server');
    } finally {
      client.release();
    }
  }

  async postPlaylistSongsById({ id, songId, userId }) {
    await this._recordActivity({
      id,
      songId,
      userId,
      action: 'add',
      async actionFunc({ client }) {
        try {
          const query = 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id';
          const psId = `playlist_song-${nanoid(16)}`;
          const result = await client.query(query, [psId, id, songId]);

          if (result.rows.length === 0) {
            throw new NotFoundError('Lagu gagal ditambahkan ke playlist');
          }
        } catch (e) {
          if (e instanceof ClientError) {
            throw e;
          } else if (e.code === '23503') {
            if (e.detail.includes('songs')) {
              throw new NotFoundError('Lagu tidak valid');
            } else if (e.detail.includes('playlists')) {
              throw new NotFoundError('Playlist tidak valid');
            }
          }
          throw new InvariantError('Terjadi kesalahan pada server');
        }
      },
    });
  }

  async getPlaylistSongsById({ id }) {
    const playlistQuery = `
    SELECT p.id id, p.name name, u.username username FROM playlists p 
    LEFT JOIN users u ON p.owner = u.id
    WHERE p.id = $1
    `;
    const playlistResultAsync = this._pool.query(playlistQuery, [id]);

    const songsQuery = `
    SELECT s.id id, s.title title, s.performer performer FROM songs s
    RIGHT JOIN playlist_songs ps ON s.id = ps.song_id
    WHERE ps.playlist_id = $1`;
    const songsResultAsync = this._pool.query(songsQuery, [id]);

    const [playlistResult, songsResult] = await Promise.all([
      playlistResultAsync,
      songsResultAsync,
    ]);

    if (playlistResult.rows.length === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return { ...playlistResult.rows[0], songs: songsResult.rows };
  }

  async deletePlaylistSongsById({ id, songId, userId }) {
    await this._recordActivity({
      id,
      songId,
      userId,
      action: 'delete',
      async actionFunc({ client }) {
        const query = 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id';
        const result = await client.query(query, [id, songId]);

        if (result.rows.length === 0) {
          throw new InvariantError('Lagu gagal dihapus');
        }
      },
    });
  }

  async getPlaylistSongActivitiesById({ id }) {
    try {
      const query = `
      SELECT * FROM playlist_song_activities psa
      LEFT JOIN users u ON u.id = psa.user_id
      LEFT JOIN songs s ON s.id = psa.song_id
      WHERE playlist_id = $1`;
      const result = await this._pool.query(query, [id]);
      return result.rows;
    } catch (e) {
      if (e instanceof ClientError) {
        throw e;
      } else if (e.code === '23503') {
        throw new NotFoundError('Playlist tidak valid');
      }
      throw new InvariantError('Terjadi kesalahan pada server');
    }
  }
}

module.exports = PlaylistSongsService;
