const express = require("express");
const router = express.Router();
require("dotenv").config();
const atcoController = require("../controllers/atcoController.js");

router.get("/", async (req, res) => {
  try {
    const controllers = await atcoController.getAllATCOs();
    return res.status(200).send(controllers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/cid/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const controllers = await atcoController.getATCOByCID(cid);
    return res.status(200).send(controllers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/initial/:initial", async (req, res) => {
  try {
    const { initial } = req.params;
    const controllers = await atcoController.getATCOByInitial(initial);
    return res.status(200).send(controllers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;