const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewCollaboration({ playlistId, userId }) {
    const query = 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2';
    const result = await this._pool.query(query, [playlistId, userId]);

    if (result.rows.length > 0) {
      throw new InvariantError('Kolaborator playlist sudah ditambahkan');
    }
  }

  async addCollaboration({ playlistId, userId }) {
    await this.verifyNewCollaboration({ playlistId, userId });

    const id = `collaboration-${nanoid(16)}`;
    const query = 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING playlist_id';
    const result = await this._pool.query(query, [id, playlistId, userId]);

    if (result.rows.length === 0) {
      throw new InvariantError('Kolaborator playlist gagal ditambahkan');
    }

    return result.rows[0].playlist_id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING playlist_id';
    const result = await this._pool.query(query, [playlistId, userId]);

    if (result.rows.length === 0) {
      throw new InvariantError('Kolaborator playlist gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;
