const pool = require("../config/mysql");

const getCustomEvents = async () => {
  try {
    const [rows] = await pool.query(`SELECT * from events WHERE start_time >= CURDATE()`);
    const result = rows.map((event) => ({
      ...event,
      is_exam: false,
    }));
    return { events: result, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getCustomEventByID = async (id) => {
  try {
    const query = `SELECT * from events WHERE start_time >= CURDATE() AND id = ?`;

    const values = [id];

    const [rows] = await pool.query(query, values);

    return { events: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const createEvent = async (name, startTime, endTime, description) => {
  if (!name || !startTime || !endTime || !description) {
    return { message: "Missing fields." };
  }

  try {
    const query = `INSERT INTO events (name, start_time, end_time, description) VALUES (?, ?, ?, ?)`;

    const values = [name, startTime, endTime, description];
    const [rows] = await pool.query(query, values);

    return { result: rows };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const updateEvent = async (id, updates) => {
  if (!id || Object.keys(updates).length === 0) {
    return { message: "Missing fields." };
  }

  try {
    let updateQuery = "UPDATE events SET ";

    const updateFields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      updateFields.push(`${key} = ?`);
      values.push(value);
    });

    updateQuery += updateFields.join(", ");
    updateQuery += ` WHERE id = ?`;
    values.push(id);

    const [rows] = await pool.query(updateQuery, values);

    return { result: rows };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const deleteEvent = async (id) => {
  try {
    const query = `DELETE FROM events WHERE id = ?`;

    const values = [id];

    await pool.query(query, values);
    return { result: { affectedRows: 1 } };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

module.exports = {
  getCustomEvents,
  getCustomEventByID,
  createEvent,
  updateEvent,
  deleteEvent,
};
