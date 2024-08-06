const con = require("../config/mysql");
const util = require("util");
const query = util.promisify(con.query).bind(con);
const axios = require("axios");

const getAllBookings = async () => {
  try {
    const result = await query(`SELECT * from controllerBookings ORDER BY id`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const getBookingsByInitial = async (initial) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE initial = '${initial}' ORDER BY id`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const getBookingsByDate = async (date) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE DATE(startTime) = '${date}' ORDER BY id`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const getBookingByID = async (id) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE id = ${id} ORDER BY id`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const createBooking = async (initial, cid, name, startTime, endTime, sector, subSector) => {
  if (!initial || !cid || !name || !startTime || !endTime || !sector || !subSector) {
    return { message: "Missing fields." };
  }

  let training = 0;

  try {
    const response = await axios.get(`https://api.vatsim.net/v2/members/${cid}`);
    const userRating = response.data.rating;
    const minRatingQ = await query(`SELECT minRating from sectors WHERE id = '${sector}'`);
    const minRating = minRatingQ[0].minRating;

    training = userRating < minRating ? 1 : 0;
  } catch (error) {
    return { error: error };
  }


  try {
    const result = await query(`
      INSERT INTO controllerBookings (initial, cid, name, startTime, endTime, sector, subSector, training) 
      VALUES ('${initial}', ${cid}, '${name}', '${startTime}', '${endTime}', '${sector}', '${subSector}', ${training})
    `);
    return { result: result };
  } catch (error) {
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
      const response = await axios.get(`https://api.vatsim.net/v2/members/${updates.cid}`);

      const userRating = response.data.rating;

      const sector = updates.sector || (await query(`SELECT sector FROM controllerBookings WHERE id = '${id}'`))[0].sector;

      const minRatingQ = await query(`SELECT minRating from sectors WHERE id = '${sector}'`);
      const minRating = minRatingQ[0].minRating;

      training = userRating < minRating ? 1 : 0;
    }


    let updateQuery = "UPDATE controllerBookings SET ";
    const updateFields = [];

    updateFields.push(`training = ${training}`);

    Object.keys(updates).forEach((key) => {
      updateFields.push(`${key} = '${updates[key]}'`);
    });

    updateQuery += updateFields.join(", ");
    updateQuery += ` WHERE id = '${id}'`;

    const result = await query(updateQuery);
    return { result: result };
  } catch (error) {
    console.log(error)
    return { error: error };
  }
};

const deleteBooking = async (id) => {
  try {
    const result = await query(`DELETE FROM controllerBookings WHERE id = '${id}'`);

    return { result: result };
  } catch (error) {
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
