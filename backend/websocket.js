const axios = require("axios");

let vatsimData = {
  flightplans: [],
  departureMessages: [],
  arrivalMessages: [],
};
let currentDay = null;
let currentMessageNumber = 0;

async function fetchVatsimData() {
  try {
    const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
    const dayOfMonth = new Date().getDate();

    if (currentDay !== dayOfMonth) {
      currentMessageNumber = 0;
      vatsimData.flightplans = [];
    }

    currentDay = dayOfMonth;

    vatsimData.flightplans = restructureData(filterVatsimData(response.data));
  } catch (error) {
    console.error("Hiba történt a VATSIM adatok lekérésekor:", error.message);
  }
}

function restructureData(data) {
  let newData = [];

  data.forEach((element) => {
    if (element.flight_plan) {
      let aircraftSplit = element.flight_plan.aircraft ? element.flight_plan.aircraft.split("/") : [];
      let atyp = aircraftSplit[0] || "";
      let wtc = aircraftSplit[1] && aircraftSplit[1].includes("-") ? aircraftSplit[1].split("-")[0] : "";
      let equipment = aircraftSplit[1] && aircraftSplit[1].includes("-") ? aircraftSplit[1].split("-")[1] : "";
      let TransponderEquipment = aircraftSplit[2] || "";

      const existingIndex = vatsimData.flightplans.findIndex((item) => item.callsign === element.callsign);
      const existingAircraft = vatsimData.flightplans[existingIndex];

      const isNew = !existingAircraft;
      if (isNew) {
        currentMessageNumber++;
      }

      let currJson = {
        messageType: "flightplan",
        callsign: element.callsign !== undefined ? element.callsign : "unknown",
        groundspeed: element.hasOwnProperty("groundspeed") ? element.groundspeed : "unknown",
        transponderCode: element.hasOwnProperty("transponder") ? element.transponder : "unknown",
        flightRules: element.flight_plan && element.flight_plan.hasOwnProperty("flight_rules") ? element.flight_plan.flight_rules : "unknown",
        aircraftType: atyp !== undefined ? atyp : "unknown",
        aircraftWTC: wtc !== undefined ? wtc : "unknown",
        aircraftEquipment: equipment !== undefined ? equipment : "unknown",
        aircraftTransponder: TransponderEquipment !== undefined ? TransponderEquipment : "unknown",
        departure: element.flight_plan && element.flight_plan.hasOwnProperty("departure") ? element.flight_plan.departure : "unknown",
        arrival: element.flight_plan && element.flight_plan.hasOwnProperty("arrival") ? element.flight_plan.arrival : "unknown",
        alternate: element.flight_plan && element.flight_plan.hasOwnProperty("alternate") ? element.flight_plan.alternate : "unknown",
        cruiseTAS: element.flight_plan && element.flight_plan.hasOwnProperty("cruise_tas") ? element.flight_plan.cruise_tas : "unknown",
        altitude: element.flight_plan && element.flight_plan.hasOwnProperty("altitude") ? element.flight_plan.altitude : "unknown",
        departureTime: element.flight_plan && element.flight_plan.hasOwnProperty("deptime") ? element.flight_plan.deptime : "unknown",
        enrouteTime: element.flight_plan && element.flight_plan.hasOwnProperty("enroute_time") ? element.flight_plan.enroute_time : "unknown",
        fuelTime: element.flight_plan && element.flight_plan.hasOwnProperty("fuel_time") ? element.flight_plan.fuel_time : "unknown",
        remarks: element.flight_plan && element.flight_plan.hasOwnProperty("remarks") ? element.flight_plan.remarks : "unknown",
        route: element.flight_plan && element.flight_plan.hasOwnProperty("route") ? element.flight_plan.route : "unknown",
        isNew: isNew,
        messageNumber: isNew ? currentMessageNumber : existingAircraft.messageNumber,
        inFlight: element.groundspeed >= 60,
        messageTime: isNew ? new Date().toISOString() : existingAircraft.fileTime,
      };

      if (existingAircraft) {
        if (existingAircraft.inFlight == false && currJson.inFlight == true) {
          sendDepartureMessage(currJson);
        }

        newData[existingIndex] = currJson;
      } else {
        newData.push(currJson);
      }
    }
  });

  return newData;
}

function filterVatsimData(data) {
  return [...(data.pilots || []), ...(data.prefiles || [])].filter((item) => item.flight_plan && item.flight_plan.remarks && item.flight_plan.remarks.includes("LHCC"));
}

fetchVatsimData();
setInterval(fetchVatsimData, 15000);

function setupWebSocket(io) {
  io.on("connection", (socket) => {
    console.log("WS Connection opened");

    if (vatsimData) {
      socket.emit("dataRefresh", vatsimData);
    }

    const interval = setInterval(() => {
      if (vatsimData) {
        socket.emit("dataRefresh", vatsimData);
      }
    }, 15000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("WebSocket kapcsolat lezárva.");
    });

    socket.on("error", console.error);
  });
}

function extractDOF(remarks) {
  const dofMatch = remarks.match(/DOF\/(\d{6})/);

  if (dofMatch) {
    return `DOF/${dofMatch[1]}`;
  }

  return "";
}

function sendDepartureMessage(fltplan) {
  if (fltplan) {
    dof = extractDOF(fltplan.remarks);

    const currJson = {
      messageType: "departureMessage",
      callsign: fltplan.callsign,
      transponderCode: fltplan.transponderCode,
      departure: fltplan.departure,
      arrival: fltplan.arrival,
      departureTime: fltplan.departureTime,
      dof: dof,
      messageTime: new Date().toISOString(),
    };

    vatsimData.departureMessages.push(currJson);
  }
}

module.exports = setupWebSocket;
