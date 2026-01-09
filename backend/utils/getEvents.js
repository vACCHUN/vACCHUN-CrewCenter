const axios = require("axios");

async function getEvents() {
  const response = await axios.get("https://my.vatsim.net/api/v2/events/latest");

  const events = response.data.data
    .filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")))
    .map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_time,
      end_time: event.end_time,
      description: event.description,
      is_exam: event.type === "Controller Examination",
    }));

  return events;
}

module.exports = { getEvents };
