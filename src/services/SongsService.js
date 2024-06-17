const { nanoid } = require("nanoid");
const { mapDBToModelSong, mapDBToModelSongDetail } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");

class SongsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addSong({ title, year, genre, performer, duration, albumId }) {
		const id = "song-" + nanoid(16);
		const query = `INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
		const result = await this._pool.query(query, [
			id,
			title,
			year,
			genre,
			performer,
			duration,
			albumId,
		]);

		if (!result.rows[0].id) {
			throw new InvariantError("Lagu gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getSongs({ title, performer }) {
		let query = `SELECT * FROM songs`;
		let whereQueries = [];
		const values = [];
		let index = 1;

		if (title !== undefined) {
			whereQueries.push(`title ILIKE $${index++}`);
			values.push(`%${title}%`);
		}
		if (performer !== undefined) {
			whereQueries.push(`performer ILIKE $${index++}`);
			values.push(`%${performer}%`);
		}
		if (whereQueries.length !== 0) {
			query += ` WHERE ` + whereQueries.join(" AND ");
		}

		const result = await this._pool.query(query, values);
		return result.rows.map(mapDBToModelSong);
	}

	async getSongById({ id }) {
		const query = `SELECT * FROM songs WHERE id = $1`;
		const result = await this._pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new NotFoundError("Lagu tidak ditemukan");
		}

		return mapDBToModelSongDetail(result.rows[0]);
	}

	async updateSong({ id, title, year, genre, performer, duration, albumId }) {
		const query = `UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id`;
		const result = await this._pool.query(query, [
			title,
			year,
			genre,
			performer,
			duration,
			albumId,
			id,
		]);

		if (result.rows.length === 0) {
			throw new NotFoundError("Lagu gagal diubah");
		}
	}

	async deleteSong({ id }) {
		const query = `DELETE FROM songs WHERE id = $1 RETURNING id`;
		const result = await this._pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new NotFoundError("Lagu gagal dihapus");
		}
	}
}

module.exports = SongsService;
