import React, { useContext } from "react";
import useSectors from "../hooks/useSectors";
import useSubSectors from "../hooks/useSubSectors";
import AuthContext from "../context/AuthContext";
import Select from "./Select";

function SectorSelector({ bookingData, setBookingData }) {
  const { userData, isAdmin } = useContext(AuthContext);

  const { sectors, sectorsLoading } = useSectors(userData, isAdmin);
  const currentSubSectors = useSubSectors(bookingData.sector, sectors);

  return !sectorsLoading ? (
    <>
      <Select
        value={bookingData.sector || ""}
        onChange={(e) =>
          setBookingData((prevState) => ({
            ...prevState,
            sector: e.target.value,
            subSector: "none",
          }))
        }
        options={sectors}
        defaultOptionLabel="Choose"
        getOptionLabel={(option) => option.id}
        getOptionValue={(option) => option.id}
      />
      <Select
        value={bookingData.subSector || ""}
        onChange={(e) =>
          setBookingData((prevState) => ({
            ...prevState,
            subSector: e.target.value,
          }))
        }
        options={currentSubSectors}
        defaultOptionLabel="Choose"
        getOptionLabel={(option) => option}
        getOptionValue={(option) => option}
      />
    </>
  ) : (
    "Loading sectors..."
  );
}

export default SectorSelector;
