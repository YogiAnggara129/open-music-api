require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.USER_DB,
	database: process.env.DATABASE,
	password: process.env.PASSWORD_DB,
	port: process.env.PORT_DB,
	host: process.env.HOST_DB,
	connectionTimeoutMillis: 200,
});

module.exports = { pool };
