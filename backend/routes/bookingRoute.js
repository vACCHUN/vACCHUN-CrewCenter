const express = require("express");
const router = express.Router();
require("dotenv").config();
const bookingController = require("../controllers/bookingController.js");
const { getEvents } = require("../utils/getEvents.js");
const { getCustomEvents } = require("../controllers/eventController.js");
const { isoToDateString, getBookingMinutesInsideEvent, getHalfEventIntervalRoundedToFive, isEventWithinNext24HoursUTC } = require("../utils/date.js");
const { filterEventOverlap } = require("../utils/filterEventOverlap.js");

function formatDateToMySQL(datetime) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function roundTime(time) {
  const date = new Date(time);
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 5) * 5;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return formatDateToMySQL(date);
}

router.get("/", async (req, res) => {
  try {
    const bookings = await bookingController.getAllBookings();
    return res.status(200).send(bookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/initial/:initial", async (req, res) => {
  try {
    const { initial } = req.params;
    const bookings = await bookingController.getBookingsByInitial(initial);
    return res.status(200).send(bookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingController.getBookingByID(id);
    return res.status(200).send(booking);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/day/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const booking = await bookingController.getBookingsByDate(date);
    return res.status(200).send(booking);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  if (!req.body.initial || !req.body.cid || !req.body.name || !req.body.startTime || !req.body.endTime || !req.body.sector || !req.body.subSector) {
    return res.status(400).send({
      error: "Send all required fields: initial, cid, name, startTime, endTime, sector, subSector",
    });
  }

  let is_exam = req.body.is_exam !== undefined ? +req.body.is_exam : 0;

  try {
    const isAdmin = req.user ? req.user.isAdmin : false;

    console.log(req.body);
    const roundedStartTime = roundTime(req.body.startTime);
    const roundedEndTime = roundTime(req.body.endTime);

    // REGULATE EVENT BOOKINGS
    const bookingDay = isoToDateString(req.body.startTime);
    const events = await getEvents();
    const customEvents = await getCustomEvents();
    let todaysEvents = events.concat(customEvents.events).filter((event) => isoToDateString(event.start_time) == bookingDay && !event.is_exam);

    console.log(todaysEvents);
    let eventRegulationBreached = false;

    // If two events overlap, only take into account the longest of the two. If they are the same length, take both into account.
    todaysEvents = filterEventOverlap(todaysEvents);

    for (const event of todaysEvents) {
      if (isAdmin) break; // EXCLUDE ADMINS FROM RULE
      const inside24 = isEventWithinNext24HoursUTC(event);
      const minutesInsideEvent = getBookingMinutesInsideEvent(event, req.body.startTime, req.body.endTime);
      const eventHalf = getHalfEventIntervalRoundedToFive(event);
      console.log("inside24", inside24);
      console.log("minutes inside", minutesInsideEvent);
      console.log("eventhalf", eventHalf);
      console.log("condition", !inside24 && minutesInsideEvent > eventHalf);

      console.log(event);
      if (!inside24 && minutesInsideEvent > eventHalf) {
        eventRegulationBreached = true;
        break;
      }
    }

    if (eventRegulationBreached) {
      console.error("SENDING ERROR MESSAGe");
      return res.status(400).send({ message: "Bookings exceeding half of the event duration are permitted only when the event begins within 24 hours." });
    }

    const bookings = await bookingController.createBooking(req.body.initial, req.body.cid, req.body.name, roundedStartTime, roundedEndTime, req.body.sector, req.body.subSector, is_exam);
    console.log(bookings);
    return res.status(200).send(bookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    if (!Object.keys(updates).length) {
      return res.status(400).send({
        error: "Send at least one field to update",
      });
    }

    const isAdmin = req.user ? req.user.isAdmin : false;

    // REGULATE EVENT BOOKINGS
    if (updates.startTime && updates.endTime) {
      const bookingDay = isoToDateString(updates.startTime);
      const events = await getEvents();
      const customEvents = await getCustomEvents();

      let todaysEvents = events.concat(customEvents.events).filter((event) => isoToDateString(event.start_time) === bookingDay && !event.is_exam);

      // If two events overlap, only take into account the longest of the two. If they are the same length, take both into account.
      todaysEvents = filterEventOverlap(todaysEvents);

      let eventRegulationBreached = false;

      for (const event of todaysEvents) {
        if (isAdmin) break; // EXCLUDE ADMINS FROM RULE

        const inside24 = isEventWithinNext24HoursUTC(event);
        const minutesInsideEvent = getBookingMinutesInsideEvent(event, updates.startTime, updates.endTime);
        const eventHalf = getHalfEventIntervalRoundedToFive(event);

        if (!inside24 && minutesInsideEvent > eventHalf) {
          eventRegulationBreached = true;
          break;
        }
      }

      if (eventRegulationBreached) {
        return res.status(400).send({
          message: "Bookings exceeding half of the event duration are permitted only when the event begins within 24 hours.",
        });
      }
    }

    const result = await bookingController.updateBooking(id, updates);

    if (result.error) {
      return res.status(500).send({ message: result.error.message });
    }

    return res.status(200).send(result.result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await bookingController.deleteBooking(id);

    if (result.error) {
      return res.status(500).send({ message: result.error.message });
    }

    return res.status(200).send(result.result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
