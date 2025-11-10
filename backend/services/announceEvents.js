const axios = require("axios");
require("dotenv").config();
const EVENTS_WEBHOOK = process.env.EVENTS_WEBHOOK;
const ATCO_ROLE_ID = process.env.ATCO_ROLE_ID;
const NODE_ENV = process.env.NODE_ENV;
const pool = require("../config/mysql");
const { getEvents } = require("../utils/getEvents");
const { formatDate } = require("../utils/date");

// const EVENT_EXCLUDES = ["Saturday Night Ops Budapest", "Turn Around Budapest"];
const EVENT_EXCLUDES = [];

async function sendEmbed(name, startTime, endTime, description) {
  const embed = {
    title: `EVENT - ${name}`,
    description: `**${formatDate(startTime)} - ${formatDate(endTime)}**\n\n${description}`,
    color: 26303,
    timestamp: new Date().toISOString(),
    footer: { text: "EVENT NOTIFICATION" },
    author: {
      name: "vACCHUN EVENTS",
      url: "https://cc.vacchun.hu/events",
      icon_url: "https://vacchun.hu/img/logo.png",
    },
  };

  const message = {
    content: `<@&${ATCO_ROLE_ID}>`,
    tts: false,
    embeds: [embed],
    components: [],
    actions: {},
    flags: 0,
    username: "vACCHUN Events",
  };

  try {
    await axios.post(EVENTS_WEBHOOK, message);
  } catch (err) {
    console.error("Webhook error: ", err.response ? err.response.data : err.message);
  }
}

async function announceEvents() {
  console.log("EVENTS ANNOUNCING");
  const [customEvents] = await pool.query(`
   SELECT * FROM events WHERE DATE(start_time) = CURRENT_DATE + INTERVAL 1 DAY`);
  const vatsimEvents = await getEvents();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const vatsimEventsExcluded = vatsimEvents.filter((event) => {
    const eventDate = event.start_time.split("T")[0];

    return !EVENT_EXCLUDES.includes(event.name) && eventDate === tomorrowStr;
  });

  const allRelevantEvents = [...vatsimEventsExcluded, ...customEvents];

  allRelevantEvents.forEach((event) => {
    sendEmbed(event.name, event.start_time, event.end_time, event.description);
  });
}

module.exports = { announceEvents };
