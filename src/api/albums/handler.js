const autoBind = require("auto-bind");

class AlbumsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
		autoBind(this);
	}

	async postAlbumHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);
		const { name, year } = request.payload;

		const id = await this._service.addAlbum({ name, year });
		const response = h.response({
			status: "success",
			message: "Album berhasil ditambahkan",
			data: {
				albumId: id,
			},
		});
		response.code(201);
		return response;
	}

	async getAlbumsHandler(request, h) {
		const albums = await this._service.getAlbums();
		const response = h.response({
			status: "success",
			data: {
				albums,
			},
		});
		response.code(200);
		return response;
	}

	async getAlbumByIdHandler(request, h) {
		const { id } = request.params;
		const album = await this._service.getAlbumById({ id });
		const response = h.response({
			status: "success",
			data: {
				album,
			},
		});
		response.code(200);
		return response;
	}

	async putAlbumByIdHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);
		const { id } = request.params;
		const { name, year } = request.payload;

		await this._service.updateAlbum({ id, name, year });
		const response = h.response({
			status: "success",
			message: "Album berhasil diubah",
		});
		response.code(200);
		return response;
	}

	async deleteAlbumByIdHandler(request, h) {
		const { id } = request.params;
		await this._service.deleteAlbum({ id });
		const response = h.response({
			status: "success",
			message: "Album berhasil dihapus",
		});
		response.code(200);
		return response;
	}
}

module.exports = AlbumsHandler;
