const WebSocket = require("ws");
const axios = require("axios");

let vatsimData = null;

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

    vatsimData = filterVatsimData(response.data); 
  } catch (error) {
    console.error("Hiba történt a VATSIM adatok lekérésekor:", error.message);
  }
}

function filterVatsimData(data) {
  data = data.pilots;
  
  data = data.filter((item) => item.flight_plan && item.flight_plan.remarks && (item.flight_plan.remarks.includes("LHCC") || LHCC_BELEPOK.some(item2 => item.flight_plan.route.includes(item2))));

  return data;
}

fetchVatsimData();
setInterval(fetchVatsimData, 60000);

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
