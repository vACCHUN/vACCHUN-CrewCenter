const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const atcoController = require("../controllers/atcoController.js");

const MIN_RATING = 2;
const SUBDIVISION_ID = "FRA";

const getUniqInitial = async (lastName) => {
  const allATCOs = (await atcoController.getAllATCOs()).ATCOs;
  
  let initial = lastName.slice(0, 2).toUpperCase();
  
  let isInitialTaken = allATCOs.some(atco => atco.initial == initial);
  
  if (isInitialTaken) {
    initial = lastName[0].toUpperCase() + lastName[2].toUpperCase();
  }
  
  return initial;
};


router.post("/verifyLogin", async (req, res) => {
  const userData = req.body;
  if (Object.entries(userData).length !== 0) {
    if (userData.vatsim.subdivision.id == SUBDIVISION_ID && userData.vatsim.rating.id >= MIN_RATING) {
      const atco = await atcoController.getATCOByCID(userData.cid);
      if (atco.ATCOs.length == 0) {
        console.log("creating atc...");
        const initial = await getUniqInitial(userData.personal.name_last);
        const createRes = await atcoController.createATCO(initial, userData.cid, userData.personal.name_full, userData.vatsim.rating == 2 ? 1 : 0, 0, 0)
      }
      res.json({allowed: true});
    } else {
      res.json({allowed: false, message: "Requirements not met."});
    }
  }
});


router.post("/getToken", async (req, res) => {
  const { code } = req.body;
  const clientId = "745";
  const clientSecret = "2brGUXIxKVznoeR1TOovMA1gKmObcwaBAXRkE2NX";
  const redirectUri = "http://localhost:5173/login";

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


module.exports = router;
