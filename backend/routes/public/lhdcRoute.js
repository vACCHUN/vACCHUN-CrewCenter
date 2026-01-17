const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    return res.status(200).send({
      LHDC_rwylights: process.env.LHDC_rwylights,
      LHDC_rwyLightLevel: process.env.LHDC_rwyLightLevel,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    process.env.LHDC_rwylights = req.body.LHDC_rwylights || 1;
    process.env.LHDC_rwyLightLevel = req.body.LHDC_rwyLightLevel;

    return res.status(200).send({ status: "success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
