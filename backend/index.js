const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const app = express();
const cors = require("cors");
require("dotenv").config();
const atcoRoute = require("./routes/atcoRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");
const authRoute = require("./routes/authRoute.js");
const sectorRoute = require("./routes/sectorRoute.js");
const eventsRoute = require("./routes/eventsRoute.js");
const visitorsRoute = require("./routes/visitorsRoute.js");
const fileRoute = require("./routes/fileRoute.js");
//const setupWebSocket = require("./websocket.js");
const authMiddleware = require("./middleware/authMiddleware");

// Run cron-worker
require("./cron.js");

const PORT = 3000;
const ENV = process.env.NODE_ENV; // production or dev

if (ENV == "production") {
  app.set("trust proxy", true);

  const corsOptions = {
    origin: "https://cc.vacchun.hu",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
} else {
  const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(express.json());

app.use("/api/auth", authRoute);

app.use("/api/atcos", authMiddleware, atcoRoute);
app.use("/api/bookings", authMiddleware, bookingRoute);
app.use("/api/sectors", authMiddleware, sectorRoute);
app.use("/api/events", authMiddleware, eventsRoute);
app.use("/api/visitors", authMiddleware, visitorsRoute);
app.use("/api/files", authMiddleware, fileRoute);

app.get("/", (req, res) => {
  res.json({ message: "Express is running.", healthy: true });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

// PUBLIC API

const publicApp = express();
const lhdcRoute = require("./routes/public/lhdcRoute.js");
const aftnRoute = require("./routes/public/aftnRoute.js");

const PUBLIC_PORT = 4000;

if (ENV == "production") {
  publicApp.set("trust proxy", true);

  const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  };
  publicApp.use(cors(corsOptions));
} else {
  publicApp.use(cors());
}

publicApp.use(express.json());
publicApp.use("/api/lhdc", lhdcRoute);
publicApp.use("/api/aftn", aftnRoute);

// WEBSOCKET
/*const server = require("http").createServer(publicApp);
const io = require("socket.io")(server);
setupWebSocket(io);

server.listen(PUBLIC_PORT, () => {
  console.log(`WS Server running at http://localhost:${PUBLIC_PORT}`);
});
*/
