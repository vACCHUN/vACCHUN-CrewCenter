const axios = require("axios");


async function getEvents() {
  const response = await axios.get("https://my.vatsim.net/api/v2/events/view/division/EUD");
  const events = response.data.data.filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")));
  return events;
}

module.exports = { getEvents };
