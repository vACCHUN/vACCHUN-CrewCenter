const cron = require("node-cron");
const { syncBookings } = require("./services/syncBookings");
const { getInactive } = require("./services/messageInactive")

cron.schedule("*/15 * * * *", syncBookings);

cron.schedule("0 0 1 * *", getInactive);

getInactive();