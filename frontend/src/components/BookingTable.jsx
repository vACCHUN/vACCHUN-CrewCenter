import React, { useEffect, useState } from "react";
import CreateBookingPopup from "./CreateBookingPopup";
import "./BookingTable.css";
import axios from "axios";
import config from "../config";
const API_URL = config.API_URL;
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import Nav from "../components/Nav";


function BookingTable({ currUser }) {
  const [activeSectors, setActiveSectors] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookedSectors, setBookedSectors] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [currentUTCTime, setCurrentUTCTime] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reloadBookings, setReloadBookings] = useState(0);

  const [bookingData, setBookingData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dateTimeFormat(new Date()));

  const [eventDates, setEventDates] = useState([]);
  const [currentEvent, setCurrentEvent] = useState("No event");
  const [events, setEvents] = useState();
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(dateTimeFormat(date));
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(dateTimeFormat(date));
  };

  function dateTimeFormat(date) {
    let output = date.toISOString();
    output = output.split("T");
    return output[0];
  }

  /* This code resets the day to 'today' on every refresh of the bookings - Removed in a Quality of Life update */
  /*useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setSelectedDate(formattedToday);
  }, [reloadBookings]);*/

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings`);
        setBookingData(response.data.Bookings);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchBookingData();
  }, [reloadBookings, selectedDate]);

  useEffect(() => {
    if (selectedDate && events) {
      const dateOnly = (dateTime) => dateTime.split("T")[0];

      const event = events.find((event) => {
        const eventStartDate = dateOnly(event.start_time);
        return eventStartDate === selectedDate;
      });

      if (event) {
        const startTime = new Date(event.start_time);
        const endTime = new Date(event.end_time);

        const startHour = startTime.getUTCHours().toString().padStart(2, "0");
        const startMinute = startTime.getUTCMinutes().toString().padStart(2, "0");
        const endHour = endTime.getUTCHours().toString().padStart(2, "0");
        const endMinute = endTime.getUTCMinutes().toString().padStart(2, "0");

        const formattedEvent = `${startHour}:${startMinute} - ${endHour}:${endMinute} | ${event.name}`;
        setCurrentEvent(formattedEvent);
      } else {
        setCurrentEvent("No event");
      }
    }
  }, [selectedDate, events, reloadBookings]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        const eudEvents = response.data.data;

        if (Array.isArray(eudEvents)) {
          const LHCCEvents = eudEvents.filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")));

          let dates = [];
          setEvents(LHCCEvents);

          LHCCEvents.forEach((event) => {
            dates.push(parseISO(event.start_time));
          });
          setEventDates(dates);
        } else {
          console.error("Error: response.data.data is not an array");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchEventData();
  }, [reloadBookings]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    let bookedSectorsArr = [];
    if (bookingData) {
      bookingData.forEach((booking) => {
        let bookingStart = booking.startTime.split("T")[0];
        let booked = `${booking.sector}/${booking.subSector}`;
        if (!bookedSectorsArr.includes(booked) && bookingStart == selectedDate) {
          bookedSectorsArr.push(booked);
        }
      });
    }

    setBookedSectors(bookedSectorsArr);
  }, [bookingData, reloadBookings]);

  useEffect(() => {
    if (currUser) {
      const fetchData = async () => {
        try {
          const adminResponse = await axios.get(`${API_URL}/atcos/cid/${currUser.cid}`);
          if (adminResponse && adminResponse.data && adminResponse.data.ATCOs && adminResponse.data.ATCOs.length > 0) {
            setIsAdmin(adminResponse.data.ATCOs[0].isAdmin == 1 ? true : false);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [currUser]);

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
    console.log("reloading");
    setEditOpen(false);
    setReloadBookings(reloadBookings + 1);
  };

  let addup = 0;
  let addupSub = 0;

  console.log(editOpen);
  return (
    <>
      <Nav reloadBookings={closePopup} selectedDate={selectedDate}/>
      {editOpen ? <CreateBookingPopup closePopup={closePopup} editID={editOpen} /> : ""}
      <div className="grid grid grid-cols-3">
        <div className="font-bold pl-7 flex gap-2 items-center">
          Beültetés ATS
          <div className="flex gap-1 items-center">
            <i className="fa-regular fa-calendar"></i>
            <DatePicker dateFormat="yyyy-MM-dd" calendarStartDay={1} selected={selectedDate} onChange={(date) => setSelectedDate(dateTimeFormat(date))} highlightDates={eventDates} />
          </div>
          <i onClick={handlePrevDay} className="fa-solid fa-circle-left cursor-pointer"></i>
          <i onClick={handleNextDay} className="fa-solid fa-circle-right cursor-pointer"></i>
        </div>

        <div className="flex justify-end px-3 col-span-2">
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
            let editable = currUser.cid == booking.cid || isAdmin;
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
                  classToAdd = "megmokolt";
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
