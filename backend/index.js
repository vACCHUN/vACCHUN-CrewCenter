const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const atcoRoute = require("./routes/atcoRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const authRoute = require("./routes/authRoute.js");



const PORT = 3000;


app.use(express.json());
app.use(cors());


app.use("/atcos", atcoRoute);
app.use("/bookings", bookingRoute);
app.use("/auth", authRoute);


app.get("/", (req, res) => {
  res.json({ message: "Express is running." });
});



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
