import React, { useEffect, useState } from "react";
import "./BookingTable.css";
import Loading from "../components/Loading";
import axios from "axios";

function BookingTable({ bookings, selectedDate }) {
  const [activeSectors, setActiveSectors] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [times, setTimes] = useState([]);

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
      for (let j = 0; j < 11; j++) {
        timesArr.push(false);
      }
    }
    setTimes(timesArr);
  }, []);

  return (
    <div>
      <div className="booking-table-container">
        <table id="table" className="booking-table">
          <thead>
            <tr>
              <th rowSpan={2}>UTC Idő</th>
              {activeSectors.map((sector) => (
                <th colSpan={sector.childElements.length}>{sector.id}</th>
              ))}
            </tr>
            <tr>{activeSectors.map((sector) => sector.childElements.map((subsector) => <th>{subsector}</th>))}</tr>
          </thead>
          <tbody>
            {times.map((time, key) => {
              let bookingCells = Array(cols.length).fill(<td className="emptyCell" />);

              activeBookings.forEach((booking) => {
                const startMinute = minutesFromMidnight(booking.startTime);
                const startRow = startMinute / 5;

                if (key == startRow) {
                  bookingCells = Array(cols.length).fill(<td className="emptyCellF" />);
                  const colIndex = cols.indexOf(`${booking.sector}/${booking.subSector}`);
                  const rows = calculateMinutesBetween(booking.startTime, booking.endTime) / 5;

                  bookingCells[colIndex] = (
                    <td rowSpan={rows} data-bookingdata={`${booking.initial} ${booking.sector}/${booking.subSector}`}>
                      {booking.initial}
                    </td>
                  );
                  console.log(booking.sector)
                }
              });

              return (
                <tr key={key} data-number={key}>
                  <td className={time === false ? "hideCell" : ""} rowSpan={time === false ? 1 : 12}>
                    {time === false ? "" : time}
                  </td>
                  {bookingCells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingTable;
