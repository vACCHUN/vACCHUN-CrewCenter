const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const atcoController = require("../controllers/atcoController.js");
const visitorController = require("../controllers/visitorsController.js");

const MIN_RATING = process.env.MIN_RATING || 2;
const SUBDIVISION_ID = process.env.SUBDIVISION || "HUN";
const VATSIMURL = process.env.VATSIM_URL || "https://auth.vatsim.net";
const clientId = process.env.VATSIM_CLIENTID;
const clientSecret = process.env.VATSIM_SECRET;
const redirectUri = process.env.VATSIM_REDIRECT;

const getUniqInitial = async (fullName) => {
  const hunSpecChars = ["Á", "É", "Í", "Ó", "Ö", "Ő", "Ú", "Ü", "Ű"];
  const replaceHunChars = ["A", "E", "I", "O", "O", "O", "U", "U", "U"];

  let name = fullName.toUpperCase().replace(" ", "");

  for (let i = 0; i < hunSpecChars.length; i++) {
    name = name.replaceAll(hunSpecChars[i], replaceHunChars[i]);
  }
  const allATCOs = (await atcoController.getAllATCOs()).ATCOs;
  const takenInitials = allATCOs.map((atco) => atco.initial);

  for (let i = 0; i < name.length; i++) {
    const firstLetter = name[i];
    for (let j = i + 1; j < name.length; j++) {
      const secondLetter = name[j];
      const initial = firstLetter + secondLetter;
      if (!takenInitials.includes(initial)) {
        console.log("Assigned initial:", initial);
        return initial;
      }
    }
  }

  const fallbackInitial = name[0] + name[1] + "X";
  console.log("Fallback initial assigned: " + fallbackInitial);
  return fallbackInitial;
};

router.post("/verifyLogin", async (req, res) => {
  const userData = req.body;
  const cid = userData.cid;
  if (Object.entries(userData).length !== 0) {
    const isVisitor = await visitorController.isVisitor(cid);
    if (
      (userData.vatsim.subdivision.id == SUBDIVISION_ID || isVisitor) &&
      userData.vatsim.rating.id >= MIN_RATING
    ) {
      console.log("Verifying user login");
      const atco = await atcoController.getATCOByCID(userData.cid);
      if (atco.count == 0) {
        console.log("Account requirements met - Creating atc...");
        const initial = await getUniqInitial(userData.personal.name_full);
        const createRes = await atcoController.createATCO(
          initial,
          userData.cid,
          userData.personal.name_full,
          userData.vatsim.rating == 2 ? 1 : 0,
          0,
          0,
          userData.access_token,
        );
        console.log("New ATC Result: ", createRes);
      }
      if (atco.count > 0 && atco.ATCOs[0].access_token == null)
        return res.json({ allowed: false });
      res.json({ allowed: true });
    } else {
      res.json({ allowed: false, message: "Requirements not met." });
    }
  }
});

router.post("/getToken", async (req, res) => {
  const { code } = req.body;
  console.log("Authenticating with token: " + code);

  try {
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "authorization_code");
    requestBody.append("client_id", clientId);
    requestBody.append("client_secret", clientSecret);
    requestBody.append("code", code);
    requestBody.append("redirect_uri", redirectUri);

    const response = await axios.post(
      `${VATSIMURL}/oauth/token`,
      requestBody.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const accessToken = response.data.access_token;
    console.log("Token Result data: ", response.data);

    if (accessToken) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${VATSIMURL}/api/user?client_id=${clientId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const userResponse = await axios(config);
      const userCID = userResponse.data.data.cid;
      console.log("User data fetched: ", userResponse.data);

      await atcoController.updateAccessToken(userCID, accessToken);
    } else {
      console.log("Access token not available.");
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
