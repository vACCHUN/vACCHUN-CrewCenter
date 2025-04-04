const pool = require("../config/mysql");
const axios = require("axios");

const getAllBookings = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingsByInitial = async (initial) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE initial = '${initial}' ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingsByDate = async (date) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE DATE(startTime) = '${date}' ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingByID = async (id) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE id = ${id} ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const createBooking = async (initial, cid, name, startTime, endTime, sector, subSector) => {
  if (!initial || !cid || !name || !startTime || !endTime || !sector || !subSector) {
    return { message: "Missing fields." };
  }

  let training = 0;

  try {
    let userRating = 12;

    try {
      const response = await axios.get(`https://api.vatsim.net/v2/members/${cid}`);
      userRating = response.data.rating;
    } catch (apiError) {
      console.warn("API Error (Expected in Dev Environment):", apiError.message || apiError);
    }

    const [minRatingQRows, minRatingQFields] = await pool.query(`SELECT minRating FROM sectors WHERE id = '${sector}'`);
    const minRating = minRatingQRows[0]?.minRating ?? 0;

    training = userRating < minRating ? 1 : 0;
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }

  try {
    const [rows, fields] = await pool.query(`
      INSERT INTO controllerBookings (initial, cid, name, startTime, endTime, sector, subSector, training) 
      VALUES ('${initial}', ${cid}, '${name}', '${startTime}', '${endTime}', '${sector}', '${subSector}', ${training})
    `);
    return { result: rows };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const updateBooking = async (id, updates) => {
  if (!id || Object.keys(updates).length === 0) {
    return { message: "Missing fields." };
  }

  let training = 0;

  try {
    if (updates.cid) {
      try {
        const response = await axios.get(`https://api.vatsim.net/v2/members/${updates.cid}`);
        const userRating = response.data.rating;

        const sector = updates.sector || (await pool.query(`SELECT sector FROM controllerBookings WHERE id = '${id}'`))[0].sector;

        const [minRatingQRows, minRatingQFields] = await pool.query(`SELECT minRating from sectors WHERE id = '${sector}'`);
        const minRating = minRatingQRows[0].minRating;

        training = userRating < minRating ? 1 : 0;
      } catch (apiError) {
        console.warn("API Error (Expected in Dev Environment):", apiError.message || apiError);
      }
    }

    let updateQuery = "UPDATE controllerBookings SET ";
    const updateFields = [];

    updateFields.push(`training = ${training}`);

    Object.keys(updates).forEach((key) => {
      updateFields.push(`${key} = '${updates[key]}'`);
    });

    updateQuery += updateFields.join(", ");
    updateQuery += ` WHERE id = '${id}'`;

    const [rows, fields] = await pool.query(updateQuery);
    return { result: rows };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const deleteBooking = async (id) => {
  try {
    const [rows, fields] = await pool.query(`DELETE FROM controllerBookings WHERE id = '${id}'`);

    return { result: rows };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

module.exports = {
  getAllBookings,
  getBookingsByInitial,
  getBookingByID,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDate,
};
