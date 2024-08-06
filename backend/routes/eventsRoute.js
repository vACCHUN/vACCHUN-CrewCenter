const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://my.vatsim.net/api/v2/events/view/division/EUD");
    return res.status(200).send(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
