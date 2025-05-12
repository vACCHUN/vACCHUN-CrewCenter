const express = require("express");
const router = express.Router();
require("dotenv").config();
const { getEvents } = require("../utils/getEvents");

router.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    return res.status(200).send(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
