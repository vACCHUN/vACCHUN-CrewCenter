const WebSocket = require("ws");
const axios = require("axios");

let vatsimData = []; 
let currentDay = null;
let currentMessageNumber = 0;

const LHCC_BELEPOK = ["ABETI", "ABONY", "ABULI", "ALAMU", "AMRAX", "ANIWE", "ARSIN", "BABIT", "BABOX", "BADOR", "BADOV", "BALAP", "BALUX", "BAREB", "BEGLA", "BETED", "BINKU", "BODZA", "BOKSI", "BUDOP", "BUZRA", "DEGET", "DEMOP", "DIMLO", "DODAR", "DUZLA", "EBAMO", "EBORO", "EDEMU", "EMBUT", "EPARI", "ERGOM", "ERGUZ", "ETARO", "ETNOG", "FAHAZ", "FOGRE", "GASNA", "GAZDA", "GELKA", "GEMTO", "GILEP", "GITAS", "GOTAR", "IBLIZ", "ILHAK", "INVED", "JOZEP", "KARIL", "KEKED", "KENIN", "KEROP", "KEZAL", "KOLUM", "KOPRY", "KOVEK", "KUSIS", "KUVEX", "LAHOR", "LATOF", "LITKU", "LONLA", "LUVEL", "MAVIR", "MEGIK", "MIZOL", "MOPUG", "NALOX", "NARKA", "NATEX", "NEKIN", "NIKAB", "NIPUR", "NOHAT", "NORAH", "OGVUN", "OKORA", "OLATI", "ONNIS", "OSDUK", "OSLEN", "PARAK", "PATAK", "PEJKO", "PERIT", "PESAT", "PIDON", "PITOK", "PUCOG", "PUSTA", "RAKFA", "RIGSA", "ROMKA", "SASAL", "SIRDU", "SOGMO", "SOPRO", "STEIN", "SUBES", "SUFAX", "SUNIS", "SUNOR", "TEGRI", "TEKNO", "TONDO", "TORNO", "ULZAK", "UVERA", "VAJDI", "VAMOG", "VAJDI", "VEBAL", "VEBOS", "VERIG", "VETIK", "WITRI", "XOMBA", "ZOLKU", "ZURFA"];

async function fetchVatsimData() {
  try {
    const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
    const dayOfMonth = new Date().getDate();

    if (currentDay !== dayOfMonth) {
      currentMessageNumber = 0;
      vatsimData = []; 
    }

    currentDay = dayOfMonth;

    vatsimData = restructureData(filterVatsimData(response.data));
  } catch (error) {
    console.error("Hiba történt a VATSIM adatok lekérésekor:", error.message);
  }
}

function restructureData(data) {
  let newData = vatsimData;

  data.forEach((element) => {
    if (element.flight_plan) {
      let aircraftSplit = element.flight_plan.aircraft ? element.flight_plan.aircraft.split("/") : [];

      let atyp = aircraftSplit[0];
      let wtc = aircraftSplit[1].split("-")[0];
      let equipment = aircraftSplit[1].split("-")[1];
      let TransponderEquipment = aircraftSplit[2];

      const existingIndex = vatsimData.findIndex((item) => item.callsign === element.callsign);
      const existingAircraft = vatsimData[existingIndex];

      const isNew = !existingAircraft;

      if (isNew) {
        currentMessageNumber++;
      }

      let currJson = {
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
        fileTime: isNew ? new Date().toISOString() : existingAircraft.fileTime,
      };

      if (existingAircraft) {
        newData[existingIndex] = currJson;
      } else {
        newData.push(currJson);

      }
    }
  });

  return newData;
}

function filterVatsimData(data) {
  data = [...(data.pilots || []), ...(data.prefiles || [])];

  data = data.filter((item) => item.flight_plan && item.flight_plan.remarks && (item.flight_plan.remarks.includes("LHCC") || LHCC_BELEPOK.some((item2) => item.flight_plan.route.includes(item2)) || item.flight_plan.departure.startsWith("LH") || item.flight_plan.arrival.startsWith("LH")));

  return data;
}

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
