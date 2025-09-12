const express = require("express");
const router = express.Router();
require("dotenv").config();
const { getEvents } = require("../utils/getEvents");
const { getCustomEvents, getCustomEventByID, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");

router.get("/", async (req, res) => {
  try {
    const events = await getEvents(); // VATSIM events
    const customEvents = await getCustomEvents();
    return res.status(200).send(events.concat(customEvents.events));
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const events = await getCustomEventByID(id);
    return res.status(200).send(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  if (!req.body.name || !req.body.start_time || !req.body.end_time || !req.body.description) {
    return res.status(400).send({
      error: "Send all required fields: name, start_time, end_time, description",
    });
  }
  try {
    const visitors = await createEvent(req.body.name, req.body.start_time, req.body.end_time, req.body.description);
    return res.status(200).send(visitors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    if (!Object.keys(updates).length) {
      return res.status(400).send({
        error: "Send at least one field to update",
      });
    }

    const result = await updateEvent(id, updates);

    if (result.error) {
      return res.status(500).send({ message: result.error.message });
    }

    return res.status(200).send(result.result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteEvent(id);

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
