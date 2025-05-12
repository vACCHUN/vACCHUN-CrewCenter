const pool = require("../config/mysql");
const axios = require("axios");

const { isEventBooking } = require("../utils/isEventBooking.js");
const { getEvents } = require("../utils/getEvents.js");
const { getMatchingCallsign } = require("../utils/getMatchingCallsign.js");

require("dotenv").config();
const VATSIM_BOOKING_API = process.env.VATSIM_BOOKING_API;
const VATSIM_BOOKING_KEY = process.env.VATSIM_BOOKING_KEY;
const NODE_ENV = process.env.NODE_ENV;

function formatDateTime(datetimeStr) {
  return new Date(datetimeStr).toISOString().replace("T", " ").substring(0, 19);
}
const getAllBookings = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE deleted = 0 ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingsByInitial = async (initial) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE initial = '${initial}' AND deleted = 0 ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingsByDate = async (date) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE DATE(startTime) = '${date}' AND deleted = 0 ORDER BY id`);
    return { Bookings: rows, count: rows.length };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error };
  }
};

const getBookingByID = async (id) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from controllerBookings WHERE id = ${id} AND deleted = 0 ORDER BY id`);
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

  let vatsimBookingID = -1;
  let privateBooking = 0;

  try {
    const callsign = await getMatchingCallsign(sector, subSector);
    privateBooking = !callsign;
    if (!privateBooking) {
      const events = await getEvents();
      const eventBooking = isEventBooking(startTime, endTime, events);

      const payload = {
        callsign: callsign,
        cid: cid,
        type: eventBooking ? "event" : "booking",
        start: startTime,
        end: endTime,
      };

      try {
        const response = await axios.post(VATSIM_BOOKING_API, payload, {
          headers: {
            Authorization: `Bearer ${VATSIM_BOOKING_KEY}`,
            "Content-Type": "application/json",
          },
        });
        vatsimBookingID = response.data.id ?? -1;
      } catch (apiError) {
        console.error("VATSIM BOOKING API Error:", apiError);
      }
    }

    const query = `
    INSERT INTO controllerBookings (
      initial, cid, name, startTime, endTime, sector, subSector, training, private_booking, bookingapi_id, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [initial, cid, name, startTime, endTime, sector, subSector, training, privateBooking, vatsimBookingID !== -1 ? vatsimBookingID : null, vatsimBookingID !== -1 ? new Date() : null];
    const [rows, fields] = await pool.query(query, values);
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

        const sector = updates.sector || (await pool.query(`SELECT sector FROM controllerBookings WHERE id = ?`, [id]))[0][0].sector;

        const [minRatingQRows] = await pool.query(`SELECT minRating FROM sectors WHERE id = ?`, [sector]);
        const minRating = minRatingQRows[0]?.minRating ?? 0;

        training = userRating < minRating ? 1 : 0;
      } catch (apiError) {
        console.warn("API Error (Expected in Dev Environment):", apiError.message || apiError);
      }
    }

    const [[bookingRow]] = await pool.query(`SELECT * FROM controllerBookings WHERE id = ?`, [id]);
    const bookingapi_id = bookingRow?.bookingapi_id ?? null;

    const callsign = await getMatchingCallsign(updates.sector || bookingRow.sector, updates.subSector || bookingRow.subSector);
    const privateBooking = !callsign;

    const events = await getEvents();
    const eventBooking = isEventBooking(updates.startTime || bookingRow.startTime, updates.endTime || bookingRow.endTime, events);

    if (bookingapi_id && !privateBooking) {
      const payload = {
        callsign: callsign,
        cid: bookingRow.cid,
        type: eventBooking ? "event" : "booking",
        start: formatDateTime(updates.startTime || bookingRow.startTime),
        end: formatDateTime(updates.endTime || bookingRow.endTime),
      };

      try {
        await axios.put(`${VATSIM_BOOKING_API}/${bookingapi_id}`, payload, {
          headers: {
            Authorization: `Bearer ${VATSIM_BOOKING_KEY}`,
          },
        });
      } catch (apiError) {
        console.error("VATSIM BOOKING API Update Error:", apiError.message || apiError);
      }
    }

    let updateQuery = "UPDATE controllerBookings SET ";
    const updateFields = [];

    updateFields.push(`training = ${training}`);
    updateFields.push(`updated_at = ?`);
    if (bookingapi_id && !privateBooking) {
      updateFields.push(`synced_at = ?`);
    }

    if (privateBooking) {
      updateFields.push(`private_booking = 1`);
    }

    const now = new Date();
    const values = [now];

    if (bookingapi_id && !privateBooking) {
      values.push(now);
    }

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

const deleteBooking = async (id) => {
  try {
    let bookingApiID = -1;
    try {
      const [idrows] = await pool.query(`SELECT bookingapi_id FROM controllerBookings WHERE id = '${id}'`);
      if (idrows.length > 0) {
        bookingApiID = idrows[0].bookingapi_id;
      }
    } catch (error) {
      console.log(error);
    }

    let syncSuccess = false;

    try {
      if (bookingApiID !== -1) {
        const res = await axios.delete(`${VATSIM_BOOKING_API}/${bookingApiID}`, {
          headers: {
            Authorization: `Bearer ${VATSIM_BOOKING_KEY}`,
          },
        });

        if (res.status === 204) {
          syncSuccess = true;
        }
      }
    } catch (apiError) {
      console.error("VATSIM BOOKING API Update Error:", apiError.message || apiError);
    }

    if (syncSuccess) {
      const [rows, fields] = await pool.query(`
        UPDATE controllerBookings
        SET deleted = 1, synced_at = NOW()
        WHERE id = '${id}'
      `);
      return { result: rows };
    } else {
      const [rows, fields] = await pool.query(`
        UPDATE controllerBookings
        SET deleted = 1
        WHERE id = '${id}'
      `);
      return { result: rows };
    }
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
