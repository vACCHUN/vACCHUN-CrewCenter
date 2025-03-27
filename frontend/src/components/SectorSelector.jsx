import React, { useContext } from "react";
import useSectors from "../hooks/useSectors";
import useSubSectors from "../hooks/useSubSectors";
import AuthContext from "../context/AuthContext";

function SectorSelector({ bookingData, setBookingData }) {
  const { userData, isAdmin } = useContext(AuthContext);

  const { sectors, sectorsLoading } = useSectors(userData, isAdmin);
  const currentSubSectors = useSubSectors(bookingData.sector, sectors);

  return !sectorsLoading ? (
    <>
      <div>
        <select value={bookingData.sector || ""} onChange={(e) => setBookingData((prevState) => ({ ...prevState, sector: e.target.value, subSector: "none" }))} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
          <option value="none" key="none">
            Choose Sector
          </option>
          {sectors.map((option, index) => (
            <option key={index} value={option.id}>
              {option.id}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select value={bookingData.subSector || ""} onChange={(e) => setBookingData((prevState) => ({ ...prevState, subSector: e.target.value }))} className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
          <option value="none" key="none">
            Choose Sector
          </option>
          {currentSubSectors.map((option, index) => (
            <option key={index} value={option.id}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  ) : (
    "Loading sectors..."
  );
}

export default SectorSelector;
