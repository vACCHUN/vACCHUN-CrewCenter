const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const atcoRoute = require("./routes/atcoRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const authRoute = require("./routes/authRoute.js");
const sectorRoute = require("./routes/sectorRoute.js");

const PORT = 3000;

// Trust proxy
app.set('trust proxy', true);

// CORS configuration
const corsOptions = {
  origin: 'https://cc.vacchun.hu', // Update this to your frontend's URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/atcos", atcoRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/auth", authRoute);
app.use("/api/sectors", sectorRoute);

app.get("/", (req, res) => {
  res.json({ message: "Express is running." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
