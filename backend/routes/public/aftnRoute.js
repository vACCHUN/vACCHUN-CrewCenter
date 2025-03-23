const express = require("express");
const router = express.Router();
require("dotenv").config();


router.get("/", async (req, res) => {
  try {
    return res.status(200).send({success: "true"});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;
