import useSectorsByMinRating from "../hooks/useSectorsByMinRating";
import useSubSectors from "../hooks/useSubSectors";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import { BookingData } from "../types/booking";
import React from "react";
import { VatsimUser } from "../types/users";

type SectorSelectorParams = {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
};

function SectorSelector({ bookingData, setBookingData }: SectorSelectorParams) {
  const { userData, isAdmin } = useAuth();
  const { sectors, sectorsLoading } = useSectorsByMinRating(userData as VatsimUser, isAdmin);
  const currentSubSectors = useSubSectors(bookingData.sector, sectors);
  
  return !sectorsLoading ? (
    <>
      <Select testid="sectorselector"
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
      <Select<string> testid="subsectorselector"
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
