const con = require("../config/mysql");
const util = require("util");
const query = util.promisify(con.query).bind(con);

const getAllBookings = async () => {
  try {
    const result = await query(`SELECT * from controllerBookings`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const getBookingsByInitial = async (initial) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE initial = '${initial}'`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const getBookingsByDate = async (date) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE DATE(startTime) = '${date}'`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};


const getBookingByID = async (id) => {
  try {
    const result = await query(`SELECT * from controllerBookings WHERE id = ${id}`);
    return { Bookings: result, count: result.length };
  } catch (error) {
    return { error: error };
  }
};

const createBooking = async (initial, cid, name, startTime, endTime, sector, subSector) => {
  if (!initial || !cid || !name || !startTime || !endTime || !sector || !subSector) {
    return { message: "Missing fields." };
  }

  try {
    const result = await query(`
      INSERT INTO controllerBookings (initial, cid, name, startTime, endTime, sector, subSector) 
      VALUES ('${initial}', ${cid}, '${name}', '${startTime}', '${endTime}', '${sector}', '${subSector}')
    `);
    return { result: result };
  } catch (error) {
    return { error: error };
  }
};

const updateBooking = async (id, updates) => {
  try {
    let updateQuery = "UPDATE controllerBookings SET ";

    const updateFields = [];
    Object.keys(updates).forEach((key) => {
      updateFields.push(`${key} = '${updates[key]}'`);
    });
    updateQuery += updateFields.join(", ");

    updateQuery += ` WHERE id = '${id}'`;

    const result = await query(updateQuery);
    return { result: result };
  } catch (error) {
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
