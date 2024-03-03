const express = require("express");
const router = express.Router();
require("dotenv").config();
const bookingController = require("../controllers/bookingController.js");

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


router.post("/add", async (req, res) => {
  if (!req.body.initial || !req.body.startTime || !req.body.endTime || !req.body.sector) {
    return res.status(400).send({
      error: "Send all required fields: initial, startTime, endTime, sector",
    });
  }
  try {
    const bookings = await bookingController.createBooking(req.body.initial, req.body.startTime, req.body.endTime, req.body.sector);
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
