const express = require("express");
const router = express.Router();
require("dotenv").config();
const sectorController = require("../controllers/sectorController.js");

router.get("/", async (req, res) => {
  try {
    const sectors = await sectorController.getAllSectors();
    return res.status(200).send(sectors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});


router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sectors = await sectorController.getSectorById(id);
    return res.status(200).send(sectors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
