import { useEffect, useMemo, useState } from "react";
import CreateBookingPopup from "./CreateBookingPopup.tsx";
import "./BookingTable.css";
import config from "../config.ts";
import Nav from "./Nav.tsx";
import Loading from "./Loading.tsx";
import { dateTimeFormat, convertToDate } from "../utils/DateTimeFormat.ts";
import useBookingData from "../hooks/useBookingData.ts";
import useActiveBookingsWithSectors from "../hooks/useActiveBookingsWithSectors.ts";
import { getAllSectors } from "../utils/sectorUtils.ts";
import BookingTableMenubar from "./TableComponents/BookingTableMenubar.js";
import BookingTableHeader from "./TableComponents/BookingTableHeader.js";
import BookingTableTimeLabels from "./TableComponents/BookingTableTimeLabels.js";
import BookingTableActiveBookings from "./TableComponents/BookingTableActiveBookings.js";
import BookingTableEmptyCells from "./TableComponents/BookingTableEmptyCells.js";
import BookingTableRedLine from "./TableComponents/BookingTableRedLine.js";
import { throwError } from "../utils/throwError.ts";
import { Sector } from "../types/sectors.ts";
import useAuth from "../hooks/useAuth.ts";

const DEFAULT_SECTOR_IDS = config.defaultSectorIds;

function BookingTable() {
  const [activeSectors, setActiveSectors] = useState<Sector[]>([]);
  const [cols, setCols] = useState<string[]>([]);
  const [editOpen, setEditOpen] = useState<number>(-1);
  const [reloadBookings, setReloadBookings] = useState(0);

  const [selectedDate, setSelectedDate] = useState(
    dateTimeFormat(convertToDate()),
  );
  const [sidebarOpen, setSidebarOpen] = useState<string | boolean>("exams");

  const bookingData = useBookingData(reloadBookings, selectedDate);

  const { activeBookings, activeBookingsLoading, exams } =
    useActiveBookingsWithSectors(bookingData, selectedDate, reloadBookings);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  const { userData } = useAuth();

  const loading = sectorsLoading || activeBookingsLoading;

  const isCurrentDaySelected = useMemo(() => {
    const today = new Date();
    const todayString = dateTimeFormat(today);
    return selectedDate === todayString;
  }, [selectedDate]);

  useEffect(() => {
    setSidebarOpen(exams.length > 0 ? "exams" : false);
  }, [exams]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setSectorsLoading(true);
        const sectors = await getAllSectors(userData?.access_token);
        if (sectors) {
          // Sorting to achieve correct order of columns
          sectors.sort((a, b) => a.priority - b.priority);

          const defaultSectors = sectors.filter((sector) =>
            DEFAULT_SECTOR_IDS.includes(sector.id),
          );

          let activeSectorArray = [...defaultSectors];

          activeBookings.map((booking) => {
            const sector = sectors.find(
              (sector) => sector.id === booking.sector,
            );
            if (sector && !activeSectorArray.some((s) => s.id === sector.id)) {
              let inserted = false;
              for (let i = 0; i < activeSectorArray.length; i++) {
                if (sector.priority < activeSectorArray[i].priority) {
                  activeSectorArray.splice(i, 0, sector);
                  inserted = true;
                  break;
                }
              }
              if (!inserted) {
                activeSectorArray.push(sector);
              }
            }
          });

          setActiveSectors(activeSectorArray);

          const colsArr = activeSectorArray.flatMap((sector) =>
            sector.childElements.map(
              (subSector) => `${sector.id}/${subSector}`,
            ),
          );
          setCols(colsArr);
        }
      } catch (error) {
        throwError("Error fetching sectors:", error);
      } finally {
        setSectorsLoading(false);
      }
    };

    fetchSectors();
  }, [activeBookings, reloadBookings]);

  const ROWS_N = (60 * 24) / 5 + 24 - 1;

  const gridStyles = {
    gridTemplateColumns: `repeat(${cols.length + 1}, var(--column-width))`,
    gridTemplateRows: `repeat(${ROWS_N}, var(--row-height))`,
  };

  const closePopup = () => {
    setEditOpen(-1);
    setReloadBookings(reloadBookings + 1);
  };

  return (
    <>
      <Nav reloadBookings={closePopup} selectedDate={selectedDate} />
      <BookingTableMenubar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {editOpen != -1 ? (
        <CreateBookingPopup closePopup={closePopup} editID={editOpen} />
      ) : (
        ""
      )}

      <div className="booking-table-container flex gap-5 overflow-hidden">
        <div className="booking-grid overflow-y-hidden" style={gridStyles}>
          {loading ? <Loading message="Loading bookings..." /> : <></>}
          <BookingTableHeader
            activeSectors={activeSectors}
            bookingData={bookingData}
            selectedDate={selectedDate}
          />
          <BookingTableTimeLabels />
          <BookingTableActiveBookings
            activeBookings={activeBookings}
            cols={cols}
            activeSectors={activeSectors}
            setEditOpen={setEditOpen}
          />
          <BookingTableEmptyCells
            ROWS_N={ROWS_N}
            cols={cols}
            activeSectors={activeSectors}
          />
          {isCurrentDaySelected && <BookingTableRedLine cols={cols} />}
        </div>

        {sidebarOpen == "exams" && (
          <div className="bg-headerBg">
            <div className="py-2 border w-full flex items-center justify-center border-black bg-white">
              <h1 className="text-nowrap px-4">CPT Information</h1>
            </div>

            <div className="mt-2 h-full w-max">
              {exams.length > 0 ? (
                exams.map((exam, index) => (
                  <>
                    <div
                      className="p-3 grid grid-cols-2 border border-black text-nowrap"
                      style={{ borderTop: index > 0 ? "0px" : "" }}
                      key={exam.id}
                    >
                      <div className="flex items-center text-2xl">
                        <h1>{exam.initial}</h1>
                      </div>

                      <div className="text-right">
                        <p>
                          {exam.startTime} - {exam.endTime}
                        </p>
                        <p>{exam.name}</p>
                        <p>{exam.sector}</p>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <>
                  <p className="p-3 max-w-40">No exams on the selected day.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookingTable;
