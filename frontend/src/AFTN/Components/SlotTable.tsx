import { useEffect, useState } from "react";
import api from "../config/api";
import SlotTableEntry from "./SlotTableEntry";
import { IFPS } from "../types/ifps";

function SlotTable() {
  const [lhbpData, setLhbpData] = useState<IFPS[]>([]);

  const getLhbpData = async () => {
    try {
      const res = await api.get(`/ifps/depAirport?airport=${import.meta.env.VITE_ICAO}`);
      if (res.status !== 200) return console.log("Unknown error getting cdm data.");
      const data: IFPS[] = res.data/*.filter((data: IFPS) => (data.ctot.trim() !== "" || data.atfcmStatus == "DES" || data.cdmSts == "SUSP" || data.atfcmStatus == "SLC") && data.atot.trim() === "");*/
      console.log(res);

      setLhbpData((prev) =>
        data.map((data) => {
          const callsign = data.callsign;
          const prevData = prev.filter((d) => d.callsign === callsign);

          let seen = false;

          if (prevData.length > 0 && prevData[0].atfcmStatus === data.atfcmStatus) {
            seen = prevData[0].seen !== undefined ? prevData[0].seen : false;
          }

          console.log(prevData.length, prevData[0]?.atfcmStatus, data.atfcmStatus);

          console.log("prevData", prevData[0], "newData", data);

          return { ...data, seen: seen };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLhbpData();
    const interval = setInterval(() => {
      getLhbpData();
      console.log("Refreshing data.");
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const setDataSeen = (callsign: string) => {
    if (callsign == "*") {
      return setLhbpData((prev) => prev.map((data) => ({ ...data, seen: true })));
    }
    return setLhbpData((prev) => prev.map((data) => (data.callsign == callsign ? { ...data, seen: true } : data)));
  };

  return (
    <div className="bg-white pt-4 px-3 h-[768px] overflow-y-scroll w-[90%]">
      <table className="w-full border font-bold">
        <thead>
          <tr>
            <th className="px-2 border-b text-lg">Járat</th>
            <th className="px-2 border-b w-min text-lg"></th>
            <th className="px-2 border-b text-lg">Résidő</th>
            <th className="px-2 border-b text-lg">STU</th>
            <th className="px-2 border-b text-lg">Felszállásig</th>
            <th className="px-2 border-b text-lg">REA</th>
            <th className="px-2 border-b text-[10px] cursor-pointer"><button onClick={() => { setDataSeen("*") }}>Nyugta mind</button></th>
            <th className="px-2 border-b text-lg"></th>
            <th className="px-2 border-b text-lg"></th>
            <th className="px-2 border-b text-lg">Távirat</th>
          </tr>
        </thead>
        <tbody>
          {lhbpData.filter(data => !(data.seen && data.atfcmStatus === "SLC")).map((data) => (
            <SlotTableEntry refreshData={getLhbpData} setSeen={setDataSeen} seen={data.seen || false} callsign={data.callsign} atfcmStatus={data.atfcmStatus} cdmStatus={data.cdmSts} ctot={data.ctot} key={data.callsign} />
          ))}
          {/*<tr className="border-b h-[28px]">
            <td className="text-left ps-3 bg-[#ffff4d]"></td>
            <td className="text-center"></td>
            <td className="text-center bg-[#ffff4d]"></td>
            <td className="text-center bg-[#ffff4d]"></td>
            <td className="text-center bg-[#ffff4d]"></td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400"></td>
            <td className="text-center text-gray-600 bg-[#ababab]"></td>
            <td className="text-center bg-[#ababab]"></td>
            <td className="text-center bg-[#ababab] text-[#ff0000]"></td>
            <td className="text-center bg-[#ababab] text-[#247d14]"></td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3 bg-[#ffff4d]">RYR3PJ</td>
            <td className="text-center">SAM</td>
            <td className="text-center bg-[#ffff4d]">17:05</td>
            <td className="text-center bg-[#ffff4d]">16:50</td>
            <td className="text-center bg-[#ffff4d]">-36 perc</td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400">Nem</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3 bg-[#ff0000]">DLH68M</td>
            <td className="text-center">SAM</td>
            <td className="text-center bg-[#ff0000]">17:05</td>
            <td className="text-center bg-[#ff0000]">16:50</td>
            <td className="text-center bg-[#ff0000]">-36 perc</td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400">Nem</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3 bg-[#2CC939]">FIN2RL</td>
            <td className="text-center">SLC</td>
            <td className="text-center bg-[#2CC939]">---</td>
            <td className="text-center bg-[#2CC939]">---</td>
            <td className="text-center bg-[#2CC939]">---</td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400">Nem</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3">MAH752</td>
            <td className="text-center bg-orange-600 text-lime-500">SRM</td>
            <td className="text-center">17:05</td>
            <td className="text-center">16:50</td>
            <td className="text-center">120 perc</td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400">Nem</td>
            <td className="text-center text-[#ff0000] bg-[#ababab]">Nyugtáz</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3">WZZ17LJ</td>
            <td className="text-center">SRM</td>
            <td className="text-center">17:05</td>
            <td className="text-center">16:50</td>
            <td className="text-center">140 perc</td>
            <td className="text-center border-r-1 border-l-1 border-black bg-[#ababab] text-gray-400">Kiadva</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3">LOT2PL</td>
            <td className="text-center">SRM</td>
            <td className="text-center">17:05</td>
            <td className="text-center">16:50</td>
            <td className="text-center">140 perc</td>
            <td className="text-center border-r-1 border-l-1 border-black text-gray-400">Nem</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>
          <tr className="border-b h-[28px]">
            <td className="text-left ps-3">CLX56BF</td>
            <td className="text-center">SRM</td>
            <td className="text-center">17:05</td>
            <td className="text-center">16:50</td>
            <td className="text-center">140 perc</td>
            <td className="text-center bg-[#ababab] border-r-1 border-l-1 border-black text-fuchsia-800">Kiadható</td>
            <td className="text-center text-gray-600 bg-[#ababab]">OK</td>
            <td className="text-center bg-[#ababab]">DLA</td>
            <td className="text-center bg-[#ababab] text-[#ff0000]">Töröl</td>
            <td className="text-center bg-[#ababab] text-[#247d14]">Mutasd</td>
          </tr>*/}
          {/* Empty rows */}
          {Array.from({ length: 50 }).map((_, index) => (
            <tr key={index} className="border-b h-[28px]"></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SlotTable;
