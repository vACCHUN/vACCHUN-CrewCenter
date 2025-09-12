const pool = require("../config/mysql");



const getCustomEvents = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT name, start_time, end_time, description from events WHERE start_time >= CURDATE()`);
    return { events: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

module.exports = {getCustomEvents}