import { useEffect, useState } from "react";
import { IFPS } from "../types/ifps"
import axios from "axios";

type AFTNMessageProps = {
  data: null | IFPS,
  setData: (data: IFPS | null) => void;
}

const getCurrDate = () => {
  const date = new Date();
  const year = date.getUTCFullYear().toString();
  const mo = (date.getUTCMonth() + 1).toString();
  const day = date.getUTCDate().toString();

  return `${year[2]}${year[3]}${mo.padStart(2, "0")}${day.padStart(2, "0")}`
}

function getDOF(rmk: string): string | null {
  const match = rmk.match(/\bDOF\/([0-9]{6})\b/);
  return match ? match[1] : null;
}


function AFTNMessage({ data, setData }: AFTNMessageProps) {
  const [dof, setDof] = useState("...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vatsimData = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
        // @ts-ignore
        const currPilot = vatsimData.data.pilots.filter(p => p.callsign === data?.callsign)[0];
        const rmkField = currPilot.flight_plan.remarks;

        if (!rmkField.includes("DOF")) return setDof(getCurrDate());
        setDof(getDOF(rmkField) ?? "");
      } catch (error) {
        console.log("Error occured while fetching data for DOF");
      }


    };

    fetchData();
  }, [])


  return (
    <>
      {data && <div className="AFTNMessageDiv select-none p-1 text-xl fixed bg-aftnTaviratBg cursor-pointer top-[8%] translate-y-1 left-[10%] w-[82%] h-[80%] border-2 border-[#000]/80 overflow-y-scroll text-white" onDoubleClick={() => setData(null)}>
        <p>HTE0117 {data.timeReceived}</p>
        <p>FF LHCCZDZX</p>
        <p>{data.timeReceived} EUCHZMTA</p>
        <p>-TITLE {data.atfcmStatus}</p>
        <p>-ARCID {data.callsign}</p>
        <p>-IFPLID AA{data.cdmData._id.slice(0, 8).toUpperCase()}</p>
        <p>-ADEP {data.departure}</p>
        <p>-ADES {data.arrival}</p>
        <p>-EOBD {dof}</p>
        <p>-EOBT {data.eobt}</p>
        <p>-TAXITIME {data.taxi}</p>
      </div>}
    </>
  )
}

export default AFTNMessage