const express = require("express");
const router = express.Router();
require("dotenv").config();
const { getEvents } = require("../utils/getEvents");
const {getCustomEvents} = require("../controllers/eventController");

router.get("/", async (req, res) => {
  try {
    const events = await getEvents();  // VATSIM events
    const customEvents = await getCustomEvents();
    return res.status(200).send(events.concat(customEvents.events));
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
