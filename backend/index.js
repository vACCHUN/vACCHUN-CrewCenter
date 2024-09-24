const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const atcoRoute = require("./routes/atcoRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const authRoute = require("./routes/authRoute.js");
const sectorRoute = require("./routes/sectorRoute.js");
const eventsRoute = require("./routes/eventsRoute.js");
const visitorsRoute = require("./routes/visitorsRoute.js");

const PORT = process.env.EXPRESS_PORT;
const ENV = process.env.NODE_ENV; // production or dev

if (ENV == "production") {
  app.set('trust proxy', true);

  const corsOptions = {
    origin: 'https://cc.vacchun.hu',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}


app.use(express.json());

app.use("/api/atcos", atcoRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/auth", authRoute);
app.use("/api/sectors", sectorRoute);
app.use("/api/events", eventsRoute);
app.use("/api/visitors", visitorsRoute);

app.get("/", (req, res) => {
  res.json({ message: "Express is running." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// PUBLIC API

const publicApp = express();
const lhdcRoute = require("./routes/lhdcRoute.js");

const PUBLIC_PORT = 4000

if (ENV == "production") {
  publicApp.set('trust proxy', true);

  const corsOptions = {
    origin: 'https://cc.vacchun.hu',
    optionsSuccessStatus: 200
  };
  publicApp.use(cors(corsOptions));
} else {
  publicApp.use(cors());
}

publicApp.use(express.json());
publicApp.use("/api/lhdc", lhdcRoute);

publicApp.listen(PUBLIC_PORT, () => {
  console.log("Public api running.");
});

