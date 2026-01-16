import { useEffect, useMemo, useState } from "react";
import useToggleFullscreen from "../../hooks/useToggleFullscreen.ts";
import getBookedSectors from "../../utils/getBookedSectors.ts";
import { Sector } from "../../types/sectors.ts";
import { Booking } from "../../types/booking.ts";
import api from "../../axios.ts";
import { throwError } from "../../utils/throwError.ts";
import useAuth from "../../hooks/useAuth.ts";
import { SectorisationCode } from "../../types/sectors.ts";

type BookingTableHeaderParams = {
  activeSectors: Sector[];
  bookingData: Booking[];
  selectedDate: string;
};

function BookingTableHeader({
  activeSectors,
  bookingData,
  selectedDate,
}: BookingTableHeaderParams) {
  const toggleFullscreen = useToggleFullscreen();
  const { userData } = useAuth();

  const bookedSectors = useMemo(() => {
    return getBookedSectors(bookingData, selectedDate);
  }, [bookingData, selectedDate]);

  const [excludeFromStaffed, setExcludeFromStaffed] = useState<string[]>([]);

  useEffect(() => {
    const getSectorizationCodes = async () => {
      try {
        const res = await api.get("/sectors/all-sectorisations", {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });

        if (res.status != 200) {
          return console.log(
            "Error occured while getting sectorization codes (response code invalid)",
          );
        }

        const exclArr: string[] = [];
        res.data.Sectorisations.forEach((element: SectorisationCode) => {
          exclArr.push(`${element.sectorType}/${element.sectorType}`);
        });

        setExcludeFromStaffed(exclArr);
      } catch (error) {
        console.log(error);
        throwError("Error occured while getting sectorization codes", error);
      }
    };

    getSectorizationCodes();
  }, []);

  let addup = 0;
  let addupSub = 0;
  return (
    <>
      {/* UTC Time Header */}
      <div
        className="header flex flex-col"
        style={{
          gridRowStart: 1,
          gridRowEnd: 24,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        }}
      >
        <button onClick={toggleFullscreen}>
          <i className="fa-regular fa-tv text-vacchunblue absolute top-1 left-0"></i>
        </button>
        <i className="fa-solid fa-globe text-vacchunblue text-[20px] my-1"></i>
        <p>UTC time</p>
      </div>

      {/* Active Sectors */}
      {activeSectors.map((sector, key) => {
        let prevColNumber =
          key != 0 ? activeSectors[key - 1].childElements.length - 1 : 0;
        addup += prevColNumber;
        let currColNum = key + 2;

        return (
          <div
            key={`sector-${key}`}
            className={`header ${sector.childElements.length > 1 ? "doubleborder-1" : "doubleborder-2"}`}
            style={{
              gridRowStart: 1,
              gridRowEnd: 12,
              gridColumnStart: currColNum + addup,
              gridColumnEnd: currColNum + sector.childElements.length + addup,
            }}
          >
            {sector.id}
          </div>
        );
      })}

      {/* Sub-sectors */}
      {activeSectors.map((sector, key) => {
        let prevColNumber =
          key != 0 ? activeSectors[key - 1].childElements.length - 1 : 0;
        addupSub += prevColNumber;
        const currColNum = key + 2;
        return sector.childElements.map((subSector, i) => {
          const outer = i === sector.childElements.length - 1;
          const multipleChildren = sector.childElements.length > 1;
          let classToAdd = "";
          if (outer && multipleChildren) {
            classToAdd = "doubleborder-1";
          } else if (outer && !multipleChildren) {
            classToAdd = "doubleborder-2";
          }
          return (
            <div
              key={`subSector-${key}-${i}`}
              className={`subheader subheader-sticky relative ${classToAdd}`} // Add a class for the last child if needed
              style={{
                gridRowStart: 12,
                gridRowEnd: 24,
                gridColumnStart: currColNum + i + addupSub,
                gridColumnEnd: currColNum + i + 1 + addupSub,
              }}
            >
              {subSector}

              {bookedSectors.includes(`${sector.id}/${subSector}`) &&
              !excludeFromStaffed.includes(`${sector.id}/${subSector}`) ? (
                <i className="fa-solid fa-user-graduate absolute bottom-0 right-0"></i>
              ) : (
                ""
              )}
            </div>
          );
        });
      })}
    </>
  );
}

export default BookingTableHeader;
