import { convertToAviationTime } from "./ConvertToAviationTime";
interface FlightMessage {
  callsign: string;
  groundspeed: number;
  transponderCode: string;
  flightRules: string;
  aircraftType: string;
  aircraftWTC: string;
  aircraftEquipment: string;
  aircraftTransponder: string;
  departure: string;
  arrival: string;
  alternate: string;
  cruiseTAS: string;
  altitude: string;
  departureTime: string;
  enrouteTime: string;
  fuelTime: string;
  remarks: string;
  route: string;
  isNew: boolean;
  messageNumber: number;
  inFlight: boolean;
  fileTime: string;
}

function convertTAS(tas: string): string {
  return tas.padStart(4, "0");
}

function stripEndMarker(remarks: string): string {
  return remarks.replace(/ \/(V|T|R)\/$/, "");
}

export function flightplanToText(message: FlightMessage): string {
  const fileTime = convertToAviationTime(message.fileTime);
  const flightLevel = message.altitude.slice(0, -2);
  const remarks = stripEndMarker(message.remarks);
  const tas = convertTAS(message.cruiseTAS);

  return (
    `KTF${message.messageNumber} ${fileTime}\n` +
    `FF LHKRZEZX\n` +
    `${fileTime} EUCHZMFP\n` +
    `(FPL-${message.callsign}-${message.flightRules}${message.flightRules == "I" ? "S" : "G"}\n` +
    `-${message.aircraftType}/${message.aircraftWTC}-${message.aircraftEquipment}/${message.aircraftTransponder}\n` +
    `-${message.departure}${message.departureTime}\n` +
    `-N${tas}F${flightLevel} ${message.route}\n` +
    `-${message.arrival}${message.enrouteTime} ${message.alternate}\n` +
    `-${remarks})`
  );
}
