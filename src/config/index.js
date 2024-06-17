require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	connectionTimeoutMillis: 200,
});

module.exports = { pool };
