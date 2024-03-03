const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const atcoRoute = require("./routes/atcoRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const axios = require('axios');



const PORT = 3000;


app.use(express.json());
app.use(cors());


app.use("/atcos", atcoRoute);
app.use("/bookings", bookingRoute);


app.get("/", (req, res) => {
  res.json({ message: "Express is running." });
});

app.post('/getToken', async (req, res) => {
  const { code } = req.body;
  const clientId = "745";
  const clientSecret = "2brGUXIxKVznoeR1TOovMA1gKmObcwaBAXRkE2NX";
  const redirectUri = "http://localhost:5173";

  try {
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'authorization_code');
    requestBody.append('client_id', clientId);
    requestBody.append('client_secret', clientSecret);
    requestBody.append('code', code);
    requestBody.append('redirect_uri', redirectUri);

    const response = await axios.post('https://auth-dev.vatsim.net/oauth/token',
      requestBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
