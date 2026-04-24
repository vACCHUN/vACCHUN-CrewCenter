import { useEffect, useState } from "react";
import { getTimeDifferenceUtc, subtractMinutes } from "../utils/Time";
import { throwError } from "../../utils/throwError";
import aftnConfig from "../config/aftnConfig";
import api from "../../axios";
import useAuth from "../../hooks/useAuth";

type SlotTableEntryProps = {
  callsign: string;
  atfcmStatus: string;
  ctot: string;
  taxiTime: number;
  cdmStatus: string;
  mostPenalizing: string;
  seen: boolean;
  setSeen: (callsign: string) => void;
  refreshData: () => void;
  showAFTNMessage: (callsign: string) => void;
};

const CTOT_TIME_SUBTRACT = aftnConfig.CTOT_TIME_SUBTRACT;

function SlotTableEntry({ callsign, atfcmStatus, ctot, taxiTime, cdmStatus, mostPenalizing, seen, setSeen, refreshData, showAFTNMessage }: SlotTableEntryProps) {
  const isRea = cdmStatus === "REA";
  const isSuspended = cdmStatus === "SUSP";

  const { userData } = useAuth();

  // ctot = "1150"; // For testing

  if (ctot.trim() === "") ctot = "--";

  if (ctot !== "--") ctot = `${ctot[0]}${ctot[1]}:${ctot[2]}${ctot[3]}`;

  const STU = ctot === "--" ? ctot : subtractMinutes(ctot, taxiTime);

  const takeoffTime = subtractMinutes(ctot, CTOT_TIME_SUBTRACT);

  const [untilTakeoffMinutes, setUntilTakeoffMinutes] = useState<number>(getTimeDifferenceUtc(takeoffTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setUntilTakeoffMinutes(getTimeDifferenceUtc(takeoffTime));
    }, 15000);

    return () => clearInterval(interval);
  }, [takeoffTime]);

  const sendReadyMessage = async () => {
    if (isSuspended || atfcmStatus === "DES" || isRea) return;
    try {
      const res = await api.post(
        `/cdm`,
        { callsign },
        {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        }
      );

      if (res.status !== 201) return console.log("Error occured while sending ready message!");
      console.log("Ready message sent: " + callsign);
      refreshData();
    } catch (error) {
      throwError("Error occured while sending ready message!", error);
    }
  };

  const confirmEntry = () => {
    setSeen(callsign);
  };

  let isSlc = atfcmStatus === "SLC";

  let reaColumnText = isRea ? "Kiadva" : "Kiadható";
  if (isSuspended || atfcmStatus === "DES") reaColumnText = "Nem";
  if (isSlc) reaColumnText = "Nem";

  return (
    <>
      <tr className="border-b h-[28px]">
        <td
          className="text-left ps-3 text-lg"
          style={{
            ...(isSlc && { backgroundColor: "#2CC939" }),
          }}
        >
          {callsign}
        </td>
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
        <td
          className="relative group text-center text-lg"
          style={{
            ...(isSlc && { backgroundColor: "#2CC939" }),
          }}
        >
          {ctot}

          {mostPenalizing.trim() !== "" && <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Most penalizing airspace: {mostPenalizing}
          </div>}
        </td>

        <td
          className="text-center text-lg"
          style={{
            ...(isSlc && { backgroundColor: "#2CC939" }),
          }}
        >
          {STU}
        </td>
        <td
          className="text-center text-lg"
          style={{
            ...(isSlc && { backgroundColor: "#2CC939" }),
          }}
        >
          {ctot == "--" ? ctot : `${Math.floor(untilTakeoffMinutes)} perc`}
        </td>
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
        <td className="text-center text-lg bg-[#ababab] text-[#247d14] cursor-pointer">
          <button
            onClick={() => {
              showAFTNMessage(callsign);
            }}
          >
            Mutasd
          </button>
        </td>
      </tr>
    </>
  );
}

export default SlotTableEntry;
