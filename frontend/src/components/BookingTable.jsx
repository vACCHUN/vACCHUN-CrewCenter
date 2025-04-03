import React, { useEffect, useState } from "react";
import CreateBookingPopup from "./CreateBookingPopup";
import "./BookingTable.css";
import config from "../config";
import Nav from "../components/Nav";
import Loading from "./Loading.jsx";
import dateTimeFormat from "../utils/DateTimeFormat.ts";
import useBookingData from "../hooks/useBookingData.js";
import useActiveBookingsWithSectors from "../hooks/useActiveBookingsWithSectors.js";
import { getAllSectors } from "../utils/sectorUtils.ts";
import BookingTableMenubar from "./TableComponents/BookingTableMenubar.jsx";
import BookingTableHeader from "./TableComponents/BookingTableHeader.jsx";
import BookingTableTimeLabels from "./TableComponents/BookingTableTimeLabels.jsx";
import BookingTableActiveBookings from "./TableComponents/BookingTableActiveBookings.jsx";
import BookingTableEmptyCells from "./TableComponents/BookingTableEmptyCells.jsx";
import BookingTableRedLine from "./TableComponents/BookingTableRedLine.jsx";
import { throwError } from "../utils/throwError.ts";

const DEFAULT_SECTOR_IDS = config.defaultSectorIds;

function BookingTable() {
  const [activeSectors, setActiveSectors] = useState([]);
  const [cols, setCols] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [reloadBookings, setReloadBookings] = useState(0);

  const [selectedDate, setSelectedDate] = useState(dateTimeFormat(new Date()));

  const bookingData = useBookingData(reloadBookings, selectedDate);

  const { activeBookings, activeBookingsLoading } = useActiveBookingsWithSectors(bookingData, selectedDate, reloadBookings);
  const [sectorsLoading, setSectorsLoading] = useState(false);

  const loading = sectorsLoading || activeBookingsLoading;

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setSectorsLoading(true);
        const sectors = await getAllSectors();
        if (sectors) {
          // Sorting to achieve correct order of columns
          sectors.sort((a, b) => a.priority - b.priority);

          const defaultSectors = sectors.filter((sector) => DEFAULT_SECTOR_IDS.includes(sector.id));

          let activeSectorArray = [...defaultSectors];

          activeBookings.map((booking) => {
            const sector = sectors.find((sector) => sector.id === booking.sector);
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

          const colsArr = activeSectorArray.flatMap((sector) => sector.childElements.map((subSector) => `${sector.id}/${subSector}`));

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

  const ROWS_N = (60 * 24) / 5 + 24;

  const gridStyles = {
    gridTemplateColumns: `repeat(${cols.length + 1}, var(--column-width))`,
    gridTemplateRows: `repeat(${ROWS_N}, var(--row-height))`,
  };

  const closePopup = () => {
    setEditOpen(false);
    setReloadBookings(reloadBookings + 1);
  };

  return (
    <>
      <Nav reloadBookings={closePopup} selectedDate={selectedDate} />
      <BookingTableMenubar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {editOpen ? <CreateBookingPopup closePopup={closePopup} editID={editOpen} /> : ""}

      <div className="booking-table-container">
        <div className="booking-grid" style={gridStyles}>
          {loading ? <Loading type="overlay" message="Loading bookings..." /> : <></>}
          <BookingTableHeader activeSectors={activeSectors} bookingData={bookingData} selectedDate={selectedDate} />
          <BookingTableTimeLabels />
          <BookingTableActiveBookings activeBookings={activeBookings} cols={cols} activeSectors={activeSectors} setEditOpen={setEditOpen} />
          <BookingTableEmptyCells ROWS_N={ROWS_N} cols={cols} activeSectors={activeSectors} />
          <BookingTableRedLine cols={cols} />
        </div>
      </div>
    </>
  );
}

export default BookingTable;
