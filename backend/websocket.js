const WebSocket = require("ws");
const axios = require("axios");

let vatsimData = []; // This will be rebuilt every time
let currentDay = null;
let currentMessageNumber = 0;

const LHCC_BELEPOK = [
  "ABETI", "ABONY", "ABULI", "ALAMU", "AMRAX", "ANIWE", "ARSIN", "BABIT", "BABOX", "BADOR", 
  "BADOV", "BALAP", "BALUX", "BAREB", "BEGLA", "BETED", "BINKU", "BODZA", "BOKSI", "BUDOP", 
  "BUZRA", "DEGET", "DEMOP", "DIMLO", "DODAR", "DUZLA", "EBAMO", "EBORO", "EDEMU", "EMBUT", 
  "EPARI", "ERGOM", "ERGUZ", "ETARO", "ETNOG", "FAHAZ", "FOGRE", "GASNA", "GAZDA", "GELKA", 
  "GEMTO", "GILEP", "GITAS", "GOTAR", "IBLIZ", "ILHAK", "INVED", "JOZEP", "KARIL", "KEKED", 
  "KENIN", "KEROP", "KEZAL", "KOLUM", "KOPRY", "KOVEK", "KUSIS", "KUVEX", "LAHOR", "LATOF", 
  "LITKU", "LONLA", "LUVEL", "MAVIR", "MEGIK", "MIZOL", "MOPUG", "NALOX", "NARKA", "NATEX", 
  "NEKIN", "NIKAB", "NIPUR", "NOHAT", "NORAH", "OGVUN", "OKORA", "OLATI", "ONNIS", "OSDUK", 
  "OSLEN", "PARAK", "PATAK", "PEJKO", "PERIT", "PESAT", "PIDON", "PITOK", "PUCOG", "PUSTA", 
  "RAKFA", "RIGSA", "ROMKA", "SASAL", "SIRDU", "SOGMO", "SOPRO", "STEIN", "SUBES", "SUFAX", 
  "SUNIS", "SUNOR", "TEGRI", "TEKNO", "TONDO", "TORNO", "ULZAK", "UVERA", "VAJDI", "VAMOG", 
  "VAJDI", "VEBAL", "VEBOS", "VERIG", "VETIK", "WITRI", "XOMBA", "ZOLKU", "ZURFA"
];

async function fetchVatsimData() {
  try {
    const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
    const dayOfMonth = new Date().getDate();

    // Reset data if it's a new day
    if (currentDay !== dayOfMonth) {
      currentMessageNumber = 0;
      vatsimData = []; // Clear the data for a new day
    }

    currentDay = dayOfMonth;

    // Rebuild vatsimData from scratch
    vatsimData = restructureData(filterVatsimData(response.data));
  } catch (error) {
    console.error("Hiba történt a VATSIM adatok lekérésekor:", error.message);
  }
}

function restructureData(data) {
  let newData = [];

  data.forEach((element) => {
    if (element.flight_plan) {
      let aircraftSplit = element.flight_plan.aircraft ? element.flight_plan.aircraft.split("/") : [];

      let atyp = aircraftSplit[0];
      let wtc = aircraftSplit[1].split("-")[0];
      let equipment = aircraftSplit[1].split("-")[1];
      let TransponderEquipment = aircraftSplit[2];

      // Check if the callsign already exists in vatsimData
      const existingAircraft = vatsimData.find((item) => item.callsign === element.callsign);
      const isNew = !existingAircraft;

      if (isNew) {
        currentMessageNumber++; // Increment message number for new aircraft
      }

      let currJson = {
        callsign: element.callsign ? element.callsign : "unknown",
        groundspeed: element.groundspeed ? element.groundspeed : "unknown",
        transponderCode: element.transponder ? element.transponder : "unknown",
        flightRules: element.flight_plan.flight_rules ? element.flight_plan.flight_rules : "unknown",
        aircraftType: atyp,
        aircraftWTC: wtc,
        aircraftEquipment: equipment,
        aircraftTransponder: TransponderEquipment,
        departure: element.flight_plan.departure ? element.flight_plan.departure : "unknown",
        arrival: element.flight_plan.arrival ? element.flight_plan.arrival : "unknown",
        alternate: element.flight_plan.alternate ? element.flight_plan.alternate : "unknown",
        cruiseTAS: element.flight_plan.cruise_tas ? element.flight_plan.cruise_tas : "unknown",
        altitude: element.flight_plan.altitude ? element.flight_plan.altitude : "unknown",
        departureTime: element.flight_plan.deptime ? element.flight_plan.deptime : "unknown",
        enrouteTime: element.flight_plan.enroute_time ? element.flight_plan.enroute_time : "unknown",
        fuelTime: element.flight_plan.fuel_time ? element.flight_plan.fuel_time : "unknown",
        remarks: element.flight_plan.remarks ? element.flight_plan.remarks : "unknown",
        route: element.flight_plan.route ? element.flight_plan.route : "unknown",
        isNew: isNew,
        messageNumber: isNew ? currentMessageNumber : existingAircraft.messageNumber,
        inFlight: element.groundspeed >= 60,
        fileTime: new Date().toISOString(), // Timestamp for the current data
      };
      newData.push(currJson);
    }
  });

  return newData;
}

function filterVatsimData(data) {
  data = data.pilots;

  data = data.filter((item) => 
    item.flight_plan && 
    item.flight_plan.remarks && 
    (item.flight_plan.remarks.includes("LHCC") || 
    LHCC_BELEPOK.some((item2) => item.flight_plan.route.includes(item2)))
  );

  return data;
}

// Fetch data initially and then every 15 seconds
fetchVatsimData();
setInterval(fetchVatsimData, 15000);

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Új WebSocket kapcsolat létrejött!");

    if (vatsimData) {
      ws.send(JSON.stringify(vatsimData));
    }

    const interval = setInterval(() => {
      if (vatsimData) {
        ws.send(JSON.stringify(vatsimData));
      }
    }, 15000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log("WebSocket kapcsolat lezárva.");
    });
  });
}

module.exports = setupWebSocket;