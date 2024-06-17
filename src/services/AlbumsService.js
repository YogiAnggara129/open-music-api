const { nanoid } = require("nanoid");
const { mapDBToModelAlbum } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");
require("dotenv").config();

class AlbumsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addAlbum({ name, year }) {
		const id = "album-" + nanoid(16);
		const query = `INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id`;
		const result = await this._pool.query(query, [id, name, year]);

		if (!result.rows[0].id) {
			throw new InvariantError("Album gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getAlbumById({ id }) {
		const albumQuery = `SELECT * FROM albums WHERE id = $1`;
		const albumResultAsync = this._pool.query(albumQuery, [id]);

		const songsQuery = `SELECT * FROM songs WHERE album_id = $1`;
		const songsResultAsync = this._pool.query(songsQuery, [id]);

		const [albumResult, songsResult] = await Promise.all([
			albumResultAsync,
			songsResultAsync,
		]);

		if (albumResult.rows.length === 0) {
			throw new NotFoundError("Album tidak ditemukan");
		}

		return mapDBToModelAlbum({
			...albumResult.rows[0],
			songs: songsResult.rows,
		});
	}

	async updateAlbum({ id, name, year }) {
		const updatedAt = new Date().toISOString();
		let query = "UPDATE albums SET ";
		const values = [];
		let index = 1;

		if (id === undefined) {
			throw new InvariantError("ID album tidak boleh kosong");
		}

		if (name !== undefined) {
			query += `name = $${index++}, `;
			values.push(name);
		}

		if (year !== undefined) {
			query += `year = $${index++}, `;
			values.push(year);
		}

		query += `updated_at = $${index} WHERE id = $${index + 1} RETURNING id`;
		values.push(updatedAt, id);

		const result = await this._pool.query(query, values);

		if (result.rows.length === 0) {
			throw new NotFoundError("Album gagal diupdate");
		}
	}

	async deleteAlbum({ id }) {
		const query = `DELETE FROM albums WHERE id = $1 RETURNING id`;
		const result = await this._pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new NotFoundError("Album gagal dihapus");
		}
	}
}

module.exports = AlbumsService;
