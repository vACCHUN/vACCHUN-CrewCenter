const cron = require("node-cron");
const { syncBookings } = require("./services/syncBookings");
const { getInactive } = require("./services/messageInactive");
const { announceEvents } = require("./services/announceEvents");

cron.schedule("*/15 * * * *", syncBookings);

cron.schedule("0 0 1 * *", getInactive);

cron.schedule("0 9 * * *", announceEvents);


announceEvents();