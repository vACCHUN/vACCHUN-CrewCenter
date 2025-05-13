const cron = require("node-cron");
const { syncBookings } = require("./services/syncBookings");

cron.schedule("*/15 * * * *", syncBookings);
