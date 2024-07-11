const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');
const ServerError = require('../exceptions/ServerError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    try {
      const id = `collaboration-${nanoid(16)}`;
      const query = 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id';
      const result = await this._pool.query(query, [id, playlistId, userId]);

      if (!result.rowCount) {
        throw new InvariantError('Kolaborator playlist gagal ditambahkan');
      }

      return result.rows[0].id;
    } catch (e) {
      if (e instanceof ClientError) {
        throw e;
      } else if (e.code === '23503') {
        if (e.detail.includes('playlists')) {
          throw new NotFoundError('Playlist tidak valid');
        } else if (e.detail.includes('users')) {
          throw new NotFoundError('User tidak valid');
        }
      }
      throw new ServerError();
    }
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING playlist_id';
    const result = await this._pool.query(query, [playlistId, userId]);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborator playlist gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;
