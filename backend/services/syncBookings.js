const pool = require("../config/mysql");
const axios = require("axios");
require("dotenv").config();

const VATSIM_BOOKING_API = process.env.VATSIM_BOOKING_API;
const VATSIM_BOOKING_KEY = process.env.VATSIM_BOOKING_KEY;
const NODE_ENV = process.env.NODE_ENV;
const { getMatchingCallsign } = require("../utils/getMatchingCallsign.js");

const { isEventBooking } = require("../utils/isEventBooking.js");
const { getEvents } = require("../utils/getEvents.js");

function formatDateTime(datetimeStr) {
  return new Date(datetimeStr).toISOString().replace("T", " ").substring(0, 19);
}

function isBookingInPastOrOngoing(start) {
  const now = new Date();
  const startTime = new Date(start);

  return now >= startTime;
}

async function syncBookings() {
  if (NODE_ENV == "dev") {
    console.log("[CRON] No syncing in dev mode.");
    return;
  }

  console.log("🔁 Starting sync...");
  let changesNo = 0;

  try {
    const [bookings] = await pool.query("SELECT * FROM controllerBookings");

    for (const booking of bookings) {
      const {
        id,
        bookingapi_id,
        cid,
        startTime,
        endTime,
        sector,
        subSector,
        deleted,
        private_booking,
        updated_at,
        synced_at,
      } = booking;

      if (isBookingInPastOrOngoing(startTime)) {
        console.log(`[CRON] ➡️ Booking in the past or ongoing, skipping.`);
        continue;
      }

      const updated = new Date(updated_at);
      const synced = synced_at ? new Date(synced_at) : null;

      const callsign = await getMatchingCallsign(sector, subSector);

      const events = await getEvents();
      const eventBooking = isEventBooking(startTime, endTime, events);

      if (private_booking == 0) {
        // POST – if no bookingapi_id
        if (!bookingapi_id) {
          const payload = {
            callsign: callsign,
            cid: cid,
            type: eventBooking ? "event" : "booking",
            start: formatDateTime(startTime),
            end: formatDateTime(endTime),
          };
          const res = await axios.post(VATSIM_BOOKING_API, payload, {
            headers: { Authorization: `Bearer ${VATSIM_BOOKING_KEY}` },
          });

          const newBookingApiId = res.data.id;

          await pool.query(
            "UPDATE controllerBookings SET bookingapi_id = ?, synced_at = NOW() WHERE id = ?",
            [newBookingApiId, id],
          );

          console.log(`[CRON] ✅ New booking added, ID: ${newBookingApiId}`);
          changesNo++;
        }

        // 🔁 PUT || DELETE – updated_at > synced_at
        else if (!synced || updated > synced) {
          if (deleted) {
            await axios.delete(`${VATSIM_BOOKING_API}/${bookingapi_id}`, {
              headers: { Authorization: `Bearer ${VATSIM_BOOKING_KEY}` },
            });

            await pool.query(
              "UPDATE controllerBookings SET synced_at = NOW() WHERE id = ?",
              [id],
            );

            console.log(
              `[CRON] 🗑️ Booking deleted from API, ID: ${bookingapi_id}`,
            );
            changesNo++;
          } else {
            const payload = {
              callsign: callsign,
              cid: cid,
              type: eventBooking ? "event" : "booking",
              start: formatDateTime(startTime),
              end: formatDateTime(endTime),
            };

            await axios.put(`${VATSIM_BOOKING_API}/${bookingapi_id}`, payload, {
              headers: { Authorization: `Bearer ${VATSIM_BOOKING_KEY}` },
            });

            await pool.query(
              "UPDATE controllerBookings SET synced_at = NOW() WHERE id = ?",
              [id],
            );

            console.log(`[CRON] 🔄 Booking updated, ID: ${bookingapi_id}`);
            changesNo++;
          }
        }
      }
    }

    console.log(
      "[CRON] ✅ Booking sync successful, changed bookings: " + changesNo,
    );
  } catch (err) {
    console.error("[CRON] ⚠️ Something went wrong: ", err.message);
  }
}

module.exports = { syncBookings };
