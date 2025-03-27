import React, { useEffect, useState, useContext, useMemo } from "react";
import CreateBookingPopup from "./CreateBookingPopup";
import "./BookingTable.css";
import axios from "axios";
import config from "../config";
import Nav from "../components/Nav";
import AuthContext from "../context/AuthContext";
import useToggleFullscreen from "../hooks/useToggleFullscreen";
import useEventData from "../hooks/useEventData.js";
import dateTimeFormat from "../utils/DateTimeFormat.js";
import DaySelector from "./TableComponents/DaySelector";
import useCurrentEvent from "../hooks/useCurrentEvent.js";
import useBookingData from "../hooks/useBookingData.js";
import getBookedSectors from "../utils/getBookedSectors.js";
import EventContext from "../context/EventContext.jsx";

const API_URL = config.API_URL;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function BookingTable() {
  const {userData, isAdmin} = useContext(AuthContext);
  const toggleFullscreen = useToggleFullscreen();

  const [activeSectors, setActiveSectors] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [currentUTCTime, setCurrentUTCTime] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [reloadBookings, setReloadBookings] = useState(0);


  const [selectedDate, setSelectedDate] = useState(dateTimeFormat(new Date()));

  const bookingData = useBookingData(reloadBookings, selectedDate);


  const {events, eventDates, eventsLoading} = useContext(EventContext);

  const currentEvent = useCurrentEvent(selectedDate, events, reloadBookings);



  const bookedSectors = useMemo(() => {
    return getBookedSectors(bookingData, selectedDate);
  }, [bookingData, selectedDate]);


  useEffect(() => {
    const fetchActiveSectors = async () => {
      setLoading(true);
      try {
        const sectorsResponse = await axios.get(`${API_URL}/sectors`);
        const sectors = sectorsResponse.data.Sectors;

        if (bookingData) {
          const filteredBookings = bookingData.filter((booking) => {
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
        } else {
          setActiveBookings([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setLoading(false);
      }
    };

    fetchActiveSectors();
  }, [bookingData, selectedDate, reloadBookings]);

  

  function minutesFromMidnight(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return hours * 60 + minutes;
  }

  useEffect(() => {
    const fetchSectors = async () => {
      setLoading(true);
      try {
        const sectorsResponse = await axios.get(`${API_URL}/sectors`);
        const sectors = sectorsResponse.data.Sectors;

        if (sectors) {
          sectors.sort((a, b) => a.priority - b.priority);

          const defaultSectorIds = ["CDC", "GRC", "ADC", "TRE/L", "EL"];
          const defaultSectors = sectors.filter((sector) => defaultSectorIds.includes(sector.id));

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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
        setLoading(false);
      }
    };

    fetchSectors();
  }, [activeBookings, reloadBookings]);

  useEffect(() => {
    let timesArr = [];
    for (let i = 0; i < 24; i++) {
      timesArr.push(`${i}:00 - ${i + 1}:00`);
    }
    setTimes(timesArr);
  }, [reloadBookings]);

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
    setReloadBookings(reloadBookings + 1);
  };

  let addup = 0;
  let addupSub = 0;

  return (
    <>
      <Nav reloadBookings={closePopup} selectedDate={selectedDate} />
      {editOpen ? <CreateBookingPopup closePopup={closePopup} editID={editOpen} /> : ""}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0">
        <DaySelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} eventDates={eventDates} eventsLoading={eventsLoading} />

        <div className="flex justify-center md:justify-end px-4 md:px-3 md:col-span-2 text-center md:text-right">
          <p>
            {DAYS[new Date(selectedDate).getDay()]} - {currentEvent}
          </p>
        </div>
      </div>

      <div className="booking-table-container">
        <div className="booking-grid" style={gridStyles}>
          {/* UTC Time Header */}
          <div className="header flex flex-col" style={{ gridRowStart: 1, gridRowEnd: 24, gridColumnStart: 1, gridColumnEnd: 2 }}>
            <button onClick={toggleFullscreen}>
              <i className="fa-regular fa-tv text-vacchunblue absolute top-1 left-0"></i>
            </button>
            <i className="fa-solid fa-globe text-vacchunblue text-[20px] my-1"></i>
            <p>UTC time</p>
          </div>

          {/* Active Sectors */}
          {activeSectors.map((sector, key) => {
            let prevColNumber = key != 0 ? activeSectors[key - 1].childElements.length - 1 : 0;
            addup += prevColNumber;
            let currColNum = key + 2;
            const outer = false;

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
            let prevColNumber = key != 0 ? activeSectors[key - 1].childElements.length - 1 : 0;
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
                  {bookedSectors.includes(`${sector.id}/${subSector}`) ? <i className="fa-solid fa-user-graduate absolute bottom-0 right-0"></i> : ""}
                </div>
              );
            });
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
                  fontSize: 14,
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
            let editable = userData.cid == booking.cid || isAdmin;
            const fontSizeMultiplierInitial = 1.1;
            const fontSizeMultiplierTime = 0.8;
            const gridHeight = endRow - startRow;
            let fontSizeInitial = fontSizeMultiplierInitial * gridHeight;
            let fontSizeTime = fontSizeMultiplierTime * gridHeight;
            const currSector = activeSectors.find((s) => s.id == booking.sector);
            let classToAdd = "";

            if (currSector) {
              const multipleChildren = currSector.childElements.length > 1;
              const outer = currSector.childElements.indexOf(booking.subSector) == currSector.childElements.length - 1;
              if (multipleChildren && outer) {
                classToAdd = "doubleborder-1";
              } else if (!multipleChildren && outer) {
                classToAdd = "doubleborder-2";
              }
            }
            if (fontSizeInitial > 30) {
              fontSizeInitial = 30;
            }
            if (fontSizeTime > 18) {
              fontSizeTime = 18;
            }

            return (
              <div
                key={`booking-${booking.id}`}
                className={`booking ${booking.training ? "training " : ""} ${endRow - startRow < 9 ? "small " : ""} ${editable ? "editable" : ""} ${classToAdd}`}
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
                <div style={{ fontSize: `${fontSizeInitial}px` }}>{booking.initial}</div>
                <div className="leading-[25px]" style={{ fontSize: `${fontSizeTime}px`, marginTop: "auto" }}>{`${formatBookingTime(booking.startTime)} ${formatBookingTime(booking.endTime)}`}</div>
              </div>
            );
          })}

          {/* Empty Cells */}
          {Array.from({ length: rows }).map((_, rowIndex) => {
            return Array.from({ length: cols.length + 1 }).map((_, colIndex) => {
              const currCol = colIndex ? cols[colIndex - 1] : false;
              let currSector = false;
              let currSubSector = false;
              let currSectorData = false;
              let classToAdd = "";
              if (currCol) {
                let elements = currCol.split("/");
                if (elements.length == 3) {
                  currSector = elements[0].concat("/", elements[1]);
                  currSubSector = elements[2];
                } else if (elements.length == 2) {
                  currSector = elements[0];
                  currSubSector = elements[1];
                }

                currSectorData = activeSectors.find((s) => s.id == currSector);
                const outer = currSectorData.childElements.indexOf(currSubSector) == currSectorData.childElements.length - 1;

                if (currSectorData.childElements.length == 1 && outer) {
                  classToAdd = "doubleborder-2";
                } else if (currSectorData.childElements.length > 1 && outer) {
                  classToAdd = "doubleborder-grid";
                }
              }

              return rowIndex === 0 || colIndex === 0 ? null : (
                <div
                  key={`empty-${rowIndex}-${colIndex}`}
                  className={`empty-cell ${classToAdd}`}
                  style={{
                    gridRowStart: rowIndex + 1,
                    gridRowEnd: rowIndex + 2,
                    gridColumnStart: colIndex + 1,
                    gridColumnEnd: colIndex + 2,
                  }}
                />
              );
            });
          })}

          {/* Red Line for Current UTC Time */}
          {currentUTCTime && (
            <div
              className="current-time-line"
              style={{
                gridRowStart: currentUTCTime.row + 12,
                gridRowEnd: currentUTCTime.row + 12,
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
