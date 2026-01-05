import { useEffect, useState } from "react";
import { getTimeDifferenceUtc, subtractMinutes } from "../utils/Time";

type SlotTableEntryProps = {
  callsign: string;
  atfcmStatus: string;
  ctot: string;
  cdmStatus: string;
  seen: boolean;
  setSeen: (callsign: string) => void;
};

const TAXI_TIME = import.meta.env.VITE_TAXI_TIME;

function SlotTableEntry({ callsign, atfcmStatus, ctot, cdmStatus, seen, setSeen }: SlotTableEntryProps) {
  const isRea = cdmStatus === "REA";
  const isSuspended = cdmStatus === "SUSP";

  //ctot = "1150";

  if (ctot.trim() === "") ctot = "--";

  if (ctot !== "--") ctot = `${ctot[0]}${ctot[1]}:${ctot[2]}${ctot[3]}`;

  const STU = ctot === "--" ? ctot : subtractMinutes(ctot, TAXI_TIME);

  const takeoffTime = subtractMinutes(ctot, 5);

  const [untilTakeoffMinutes, setUntilTakeoffMinutes] = useState<number>(getTimeDifferenceUtc(takeoffTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setUntilTakeoffMinutes(getTimeDifferenceUtc(takeoffTime));
    }, 15000);

    return () => clearInterval(interval);
  }, [takeoffTime]);

  const sendReadyMessage = async () => {
    if (isSuspended || isRea) return;
  };

  const confirmEntry = () => {
    setSeen(callsign);
  };

  let reaColumnText = isRea ? "Kiadva" : "Kiadható";
  if (isSuspended || atfcmStatus === "DES") reaColumnText = "Nem";

  return (
    <tr className="border-b h-[28px]">
      <td className="text-left ps-3 text-lg">{callsign}</td>
      <td
        className="text-center text-lg"
        style={{
          ...(!seen && {
            backgroundColor: "#ea580c",
            color: "#84cc16",
          }),
        }}
      >
        {atfcmStatus}
      </td>
      <td className="text-center text-lg">{ctot}</td>
      <td className="text-center text-lg">{STU}</td>
      <td className="text-center text-lg">{ctot == "--" ? ctot : `${Math.floor(untilTakeoffMinutes)} perc`}</td>
      <td
        onClick={sendReadyMessage}
        className="cursor-pointer text-lg text-center border-r border-l text-gray-600 border-black"
        style={{
          ...(reaColumnText !== "Nem" && { backgroundColor: "#ababab" }),
          ...(reaColumnText === "Kiadható" && { color: "#86198f" }),
        }}
      >
        {reaColumnText}
      </td>
      <td onClick={confirmEntry} className={`cursor-pointer text-lg text-center text-gray-600 bg-[#ababab] ${!seen ? "text-[#ff0000]!" : ""}`} style={seen ? undefined : { color: "#ff0000" }}>
        {!seen ? "Nyugtáz" : "Ok"}
      </td>
      <td className="text-center text-lg bg-[#ababab]">DLA</td>
      <td className="text-center text-lg bg-[#ababab] text-[#ff0000]">Töröl</td>
      <td className="text-center text-lg bg-[#ababab] text-[#247d14]">Mutasd</td>
    </tr>
  );
}

export default SlotTableEntry;
