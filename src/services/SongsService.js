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

	async getSongs() {
		const query = `SELECT * FROM songs`;
		const result = await this._pool.query(query);
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
		const updatedAt = new Date().toISOString();
		let query = "UPDATE songs SET ";
		const values = [];
		let index = 1;

		if (id === undefined) {
			throw new InvariantError("ID lagu tidak boleh kosong");
		}

		if (title !== undefined) {
			query += `title = $${index++}, `;
			values.push(title);
		}

		if (year !== undefined) {
			query += `year = $${index++}, `;
			values.push(year);
		}

		if (genre !== undefined) {
			query += `genre = $${index++}, `;
			values.push(genre);
		}

		if (performer !== undefined) {
			query += `performer = $${index++}, `;
			values.push(performer);
		}

		if (duration !== undefined) {
			query += `duration = $${index++}, `;
			values.push(duration);
		}

		if (albumId !== undefined) {
			query += `album_id = $${index++}, `;
			values.push(albumId);
		}

		query += `updated_at = $${index} WHERE id = $${index + 1} RETURNING id`;
		values.push(updatedAt, id);
		const result = await this._pool.query(query, values);
		if (result.rows.length === 0) {
			throw new NotFoundError("Lagu gagal diupdate");
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
