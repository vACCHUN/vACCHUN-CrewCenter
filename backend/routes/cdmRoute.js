const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  if (!req.body.callsign)
    return res.status(400).send({
      error: "Send all required fields: callsign",
    });

  try {
    const cdmRes = await axios.post(`https://cdm-server-production.up.railway.app/ifps/dpi?callsign=${req.body.callsign}&value=REA/1`, undefined, {
      headers: {
        Accept: "application/json",
        "x-api-key": process.env.CDM_APIKEY,
      },
    });

    console.log("SENDING READY: ", req.body.callsign);
    console.log(cdmRes);

    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
