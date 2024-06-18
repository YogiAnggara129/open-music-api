const { nanoid } = require('nanoid');
const { mapDBToModelAlbum } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');
require('dotenv').config();

class AlbumsService {
  constructor(pool) {
    this.pool = pool;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id';
    const result = await this.pool.query(query, [id, name, year]);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById({ id }) {
    const albumQuery = 'SELECT * FROM albums WHERE id = $1';
    const albumResultAsync = this.pool.query(albumQuery, [id]);

    const songsQuery = 'SELECT * FROM songs WHERE album_id = $1';
    const songsResultAsync = this.pool.query(songsQuery, [id]);

    const [albumResult, songsResult] = await Promise.all([
      albumResultAsync,
      songsResultAsync,
    ]);

    if (albumResult.rows.length === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return mapDBToModelAlbum({
      ...albumResult.rows[0],
      songs: songsResult.rows,
    });
  }

  async updateAlbum({ id, name, year }) {
    const query = 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id';
    const result = await this.pool.query(query, [name, year, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Album gagal diubah');
    }
  }

  async deleteAlbum({ id }) {
    const query = 'DELETE FROM albums WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Album gagal dihapus');
    }
  }
}

module.exports = AlbumsService;
