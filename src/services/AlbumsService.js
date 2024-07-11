const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');
const { mapDBToModelAlbum } = require('../utils');
require('dotenv').config();

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id';
    const result = await this._pool.query(query, [id, name, year]);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById({ id }) {
    const albumQuery = 'SELECT id, name, cover, year FROM albums WHERE id = $1';
    const albumResultAsync = this._pool.query(albumQuery, [id]);

    const songsQuery = 'SELECT id, title, performer FROM songs WHERE album_id = $1';
    const songsResultAsync = this._pool.query(songsQuery, [id]);

    const [albumResult, songsResult] = await Promise.all([
      albumResultAsync,
      songsResultAsync,
    ]);

    if (!albumResult.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      ...mapDBToModelAlbum(albumResult.rows[0]),
      songs: songsResult.rows,
    };
  }

  async updateAlbum({ id, name, year }) {
    const query = 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id';
    const result = await this._pool.query(query, [name, year, id]);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal diubah');
    }
  }

  async deleteAlbum({ id }) {
    const query = 'DELETE FROM albums WHERE id = $1 RETURNING id';
    const result = await this._pool.query(query, [id]);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus');
    }
  }

  async uploadCover({ id, cover }) {
    const query = `
      UPDATE albums x
      SET    cover = $1
      FROM   albums y
      WHERE  x.id = y.id
      AND    x.id = $2
      RETURNING y.cover AS old_cover;
    `;
    const result = await this._pool.query(query, [cover, id]);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal diubah');
    }

    return result.rows[0].old_cover;
  }
}

module.exports = AlbumsService;
