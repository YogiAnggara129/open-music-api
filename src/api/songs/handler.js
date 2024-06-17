const autoBind = require("auto-bind");

class SongsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
		autoBind(this);
	}

	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const { title, year, genre, performer, duration, albumId } =
			request.payload;

		const id = await this._service.addSong({
			title,
			year,
			genre,
			performer,
			duration,
			albumId,
		});
		const response = h.response({
			status: "success",
			message: "Lagu berhasil ditambahkan",
			data: {
				songId: id,
			},
		});
		response.code(201);
		return response;
	}

	async getSongsHandler(request, h) {
		this._validator.validateSongQuery(request.payload);
		const { title, performer } = request.query;
		const songs = await this._service.getSongs({ title, performer });
		const response = h.response({
			status: "success",
			data: {
				songs,
			},
		});
		response.code(200);
		return response;
	}

	async getSongByIdHandler(request, h) {
		const { id } = request.params;
		const song = await this._service.getSongById({ id });
		const response = h.response({
			status: "success",
			data: {
				song,
			},
		});
		response.code(200);
		return response;
	}

	async putSongByIdHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const { id } = request.params;
		const { title, year, genre, performer, duration, albumId } =
			request.payload;

		await this._service.updateSong({
			id,
			title,
			year,
			genre,
			performer,
			duration,
			albumId,
		});
		const response = h.response({
			status: "success",
			message: "Lagu berhasil diubah",
		});
		response.code(200);
		return response;
	}

	async deleteSongByIdHandler(request, h) {
		const { id } = request.params;
		await this._service.deleteSong({ id });
		const response = h.response({
			status: "success",
			message: "Lagu berhasil dihapus",
		});
		response.code(200);
		return response;
	}
}

module.exports = SongsHandler;
