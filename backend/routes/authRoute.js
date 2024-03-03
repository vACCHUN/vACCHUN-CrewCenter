const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const atcoController = require("../controllers/atcoController.js");

const MIN_RATING = 2;
const SUBDIVISION_ID = "FRA";

router.post("/getToken", async (req, res) => {
  const { code } = req.body;
  const clientId = "745";
  const clientSecret = "2brGUXIxKVznoeR1TOovMA1gKmObcwaBAXRkE2NX";
  const redirectUri = "http://localhost:5173";

  try {
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "authorization_code");
    requestBody.append("client_id", clientId);
    requestBody.append("client_secret", clientSecret);
    requestBody.append("code", code);
    requestBody.append("redirect_uri", redirectUri);

    const response = await axios.post("https://auth-dev.vatsim.net/oauth/token", requestBody.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/verifyLogin", async (req, res) => {
  const userData = req.body;
  if (Object.entries(userData).length !== 0) {
    if (userData.vatsim.subdivision.id == SUBDIVISION_ID && userData.vatsim.rating.id >= MIN_RATING) {
      res.json({allowed: true});
    } else {
      res.json({allowed: false, message: "Requirements not met."});
    }
  }
});

module.exports = router;
