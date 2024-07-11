const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike({ userId, albumId }) {
    const id = `album-${nanoid(16)}`;
    const query = 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id';
    const result = await this._pool.query(query, [id, userId, albumId]);
    if (!result.rowCount) {
      throw new InvariantError('Like album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getLikeCountByAlbumId({ albumId }) {
    const query = 'SELECT COUNT(*) AS like_count FROM user_album_likes WHERE album_id = $1';
    const result = await this._pool.query(query, [albumId]);
    if (!result.rowCount) {
      throw new InvariantError('Like album gagal ditemukan');
    }
    return Number(result.rows[0].like_count);
  }

  async deleteLike({ userId, albumId }) {
    const query = 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id';
    const result = await this._pool.query(query, [userId, albumId]);
    if (!result.rowCount) {
      throw new InvariantError('Like album gagal dihapus');
    }
    return result.rows[0].id;
  }
}

module.exports = AlbumLikesService;
