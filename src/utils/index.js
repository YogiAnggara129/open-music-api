const mapDBToModelAlbum = ({ id, name, year, created_at, updated_at }) => ({
	id,
	name,
	year,
	createdAt: new Date(created_at).toISOString(),
	updatedAt: new Date(updated_at).toISOString(),
});

module.exports = { mapDBToModelAlbum };
