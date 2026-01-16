const express = require("express");
const router = express.Router();
require("dotenv").config();
const visitorsController = require("../controllers/visitorsController.js");

router.get("/", async (req, res) => {
  try {
    const visitors = await visitorsController.getAllVisitors();
    return res.status(200).send(visitors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/cid/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const visitors = await visitorsController.getVisitorsByCID(cid);
    return res.status(200).send(visitors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  if (!req.body.initial || !req.body.cid) {
    return res.status(400).send({
      error: "Send all required fields: initial, cid",
    });
  }
  try {
    const visitors = await visitorsController.createVisitor(
      req.body.cid,
      req.body.initial,
    );
    return res.status(200).send(visitors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put("/update/:cid", async (req, res) => {
  if (!req.body.initial) {
    return res.status(400).send({
      error: "Send all required fields: initial",
    });
  }

  const cid = req.params.cid;
  const initial = req.body.initial;

  try {
    const result = await visitorsController.updateVisitor(cid, initial);

    if (result.error) {
      return res.status(500).send({ message: result.error.message });
    }
    return res.status(200).send(result.result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/delete/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const result = await visitorsController.deleteVisitor(cid);

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
