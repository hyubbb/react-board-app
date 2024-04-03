require("dotenv").config();
const mariadb = require("mariadb");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 5, // 연결 풀의 크기 지정
};

const pool = mariadb.createPool({ ...dbConfig, bigIntAsNumber: true });

module.exports = pool;
