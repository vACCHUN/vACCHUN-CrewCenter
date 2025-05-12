const express = require("express");
const router = express.Router();
require("dotenv").config();
const atcoController = require("../controllers/atcoController.js");

const convertIntsToBool = (input) => {
  const convertOne = (controller) => ({
    ...controller,
    isAdmin: !!controller.isAdmin,
    isInstructor: !!controller.isInstructor,
    trainee: !!controller.trainee,
  });

  if (Array.isArray(input)) {
    return input.map(convertOne);
  } else {
    return convertOne(input);
  }
};

router.get("/", async (req, res) => {
  try {
    const controllers = await atcoController.getAllATCOs();
    const result = convertIntsToBool(controllers);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.get("/cid/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const controllers = await atcoController.getATCOByCID(cid);
    const result = convertIntsToBool(controllers);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/initial/:initial", async (req, res) => {
  try {
    const { initial } = req.params;
    const controllers = await atcoController.getATCOByInitial(initial);
    const result = convertIntsToBool(controllers);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
router.post("/add", async (req, res) => {
  if (!req.body.initial || !req.body.cid || !req.body.name) {
    return res.status(400).send({
      error: "Send all required fields: initial, cid, name",
    });
  }
  try {
    const controllers = await atcoController.createATCO(req.body.initial, req.body.cid, req.body.name, req.body.trainee, req.body.isInstructor, req.body.isAdmin);
    return res.status(200).send(controllers);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put("/update/:cid", async (req, res) => {
  const cid = req.params.cid;
  const updates = req.body;

  try {
    if (!Object.keys(updates).length) {
      return res.status(400).send({
        error: "Send at least one field to update",
      });
    }

    const result = await atcoController.updateATCO(cid, updates);

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
    const result = await atcoController.deleteATCO(cid);

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
