const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER ?? "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

const promisePool = pool.promise();

pool.on("error", function (err) {
  console.error("MySQL Pool Error: ", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("MySQL connection was closed.");
  } else if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("MySQL has too many connections.");
  } else if (err.code === "ECONNREFUSED") {
    console.error("MySQL connection was refused.");
  }
});

module.exports = promisePool;
