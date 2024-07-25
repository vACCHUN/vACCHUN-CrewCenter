import React, { useEffect, useState } from "react";
import CreateBookingPopup from "./CreateBookingPopup";
import "./BookingTable.css";
import axios from "axios";

function BookingTable({ bookings, selectedDate, currUser }) {
  const [activeSectors, setActiveSectors] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [currentUTCTime, setCurrentUTCTime] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchActiveSectors = async () => {
      setLoading(true);
      try {
        const sectorsResponse = await axios.get(`http://localhost:3000/sectors`);
        const sectors = sectorsResponse.data.Sectors;

        const filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.startTime);
          const bookingDateString = bookingDate.toISOString().split("T")[0];
          return bookingDateString === selectedDate;
        });

        const bookingsWithSectors = filteredBookings.map((booking) => {
          const sectorInfo = sectors.find((sector) => sector.id === booking.sector);
          return {
            ...booking,
            sectorInfo: sectorInfo || {},
          };
        });

        setActiveBookings(bookingsWithSectors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setLoading(false);
      }
    };

    fetchActiveSectors();
  }, [bookings, selectedDate]);

  function calculateMinutesBetween(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const differenceInMilliseconds = endDate - startDate;
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes;
  }

  function minutesFromMidnight(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return hours * 60 + minutes;
  }

  useEffect(() => {
    const fetchSectors = async () => {
      let activeSectorArray = [];

      let defaults = ["CDC", "GRC", "ADC"];

      try {
        const sectorsResponse = await axios.get(`http://localhost:3000/sectors`);
        const sectors = sectorsResponse.data.Sectors;

        const defaultSectors = sectors.filter((sector) => defaults.includes(sector.id));

        defaultSectors.forEach((defaultSector) => {
          if (!activeSectorArray.some((s) => s.id === defaultSector.id)) {
            activeSectorArray.push(defaultSector);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setLoading(false);
      }

      activeBookings.forEach((booking) => {
        const sector = booking.sectorInfo;
        if (sector && !activeSectorArray.some((s) => s.id === sector.id)) {
          if (!activeBookings.includes(sector)) {
            activeSectorArray.push(sector);
          }
        }
      });
      setActiveSectors(activeSectorArray);

      let colsArr = [];
      activeSectorArray.forEach((sector) => {
        sector.childElements.forEach((subSector) => {
          colsArr.push(`${sector.id}/${subSector}`);
        });
      });

      setCols(colsArr);
    };
    fetchSectors();
  }, [activeBookings]);

  useEffect(() => {
    let timesArr = [];
    for (let i = 0; i < 24; i++) {
      timesArr.push(`${i}:00 - ${i + 1}:00`);
    }
    setTimes(timesArr);
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
      const row = Math.round(utcMinutes / 5) + 12;
      setCurrentUTCTime({ row, time: now });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(date) {
    const now = new Date();
    let hours = now.getUTCHours().toString().padStart(2, "0");
    let minutes = now.getUTCMinutes().toString().padStart(2, "0");
    let formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }

  function formatBookingTime(time) {
    let date = new Date(time);
    let hours = date.getUTCHours().toString().padStart(2, "0");
    let minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const rows = (60 * 24) / 5 + 24;

  const gridStyles = {
    gridTemplateColumns: `repeat(${cols.length + 1}, var(--column-width))`,
    gridTemplateRows: `repeat(${rows}, var(--row-height))`,
  };

  const closePopup = () => {
    setEditOpen(false);
  }

  return (
    <>
      {editOpen ? <CreateBookingPopup closePopup={closePopup} editID={editOpen}/> : ""}
      <div className="booking-table-container">
        <div className="booking-grid" style={gridStyles}>
          {/* UTC Time Header */}
          <div className="header" style={{ gridRowStart: 1, gridRowEnd: 24, gridColumnStart: 1, gridColumnEnd: 2 }}>
            UTC Time
          </div>

          {/* Active Sectors */}
          {activeSectors.map((sector, key) => {
            const currColNum = key + 2;
            return (
              <div
                key={`sector-${key}`}
                className="header"
                style={{
                  gridRowStart: 1,
                  gridRowEnd: 12,
                  gridColumnStart: currColNum,
                  gridColumnEnd: currColNum + sector.childElements.length,
                }}
              >
                {sector.id}
              </div>
            );
          })}

          {/* Sub-sectors */}
          {activeSectors.map((sector, key) => {
            const currColNum = key + 2;
            return sector.childElements.map((subSector, i) => (
              <div
                key={`subSector-${key}-${i}`}
                className="subheader"
                style={{
                  gridRowStart: 12,
                  gridRowEnd: 24,
                  gridColumnStart: currColNum + i,
                  gridColumnEnd: currColNum + i + 1,
                }}
              >
                {subSector}
              </div>
            ));
          })}

          {/* Time Labels */}
          {times.map((time, key) => {
            let currRow = key * 12 + 24;
            return (
              <div
                key={`time-${key}`}
                className="subheader"
                style={{
                  gridRowStart: currRow,
                  gridRowEnd: currRow + 12,
                  gridColumnStart: 1,
                  gridColumnEnd: 2,
                }}
              >
                {time}
              </div>
            );
          })}

          {/* Active Bookings */}
          {activeBookings.map((booking, key) => {
            let startRow = minutesFromMidnight(booking.startTime) / 5 + 24;
            let endRow = minutesFromMidnight(booking.endTime) / 5 + 24;
            let column = cols.indexOf(`${booking.sector}/${booking.subSector}`) + 2;
            let editable = currUser.cid == booking.cid;

            return (
              <div
                key={`booking-${booking.id}`}
                className={`booking ${booking.training ? "training " : ""} ${endRow - startRow < 9 ? "small " : ""} ${editable ? "editable" : ""}`}
                style={{
                  gridRowStart: startRow,
                  gridRowEnd: endRow,
                  gridColumnStart: column,
                  gridColumnEnd: column + 1,
                }}
                onClick={() => {
                  editable ? setEditOpen(booking.id) : "";
                }}
              >
                <div>{booking.initial}</div>
                <div>{`${formatBookingTime(booking.startTime)} - ${formatBookingTime(booking.endTime)}`}</div>
              </div>
            );
          })}

          {/* Empty Cells */}
          {Array.from({ length: rows }).map((_, rowIndex) =>
            Array.from({ length: cols.length + 1 }).map((_, colIndex) =>
              rowIndex === 0 || colIndex === 0 ? null : (
                <div
                  key={`empty-${rowIndex}-${colIndex}`}
                  className="empty-cell"
                  style={{
                    gridRowStart: rowIndex + 1,
                    gridRowEnd: rowIndex + 2,
                    gridColumnStart: colIndex + 1,
                    gridColumnEnd: colIndex + 2,
                  }}
                />
              )
            )
          )}

          {/* Red Line for Current UTC Time */}
          {currentUTCTime && (
            <div
              className="current-time-line"
              style={{
                gridRowStart: currentUTCTime.row + 1,
                gridRowEnd: currentUTCTime.row + 2,
                gridColumnStart: 2,
                gridColumnEnd: cols.length + 2,
              }}
            >
              <div className="current-time-label">{formatTime()}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookingTable;
