import React, { useEffect, useState } from "react";
import "./BookingTable.css";
import Loading from "../components/Loading";
import axios from "axios";

const BookingTable = ({ bookings, selectedDate }) => {
  const [activeSectors, setActiveSectors] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState([]);

  const intervalMinutes = 5;

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

  useEffect(() => {
    let activeSectorArray = [];

    activeBookings.forEach((booking) => {
      const sector = booking.sectorInfo;
      if (sector && !activeSectorArray.some((s) => s.id === sector.id)) {
        activeSectorArray.push(sector);
      }
    });

    setActiveSectors(activeSectorArray);
  }, [activeBookings]);

  function getMinutesSinceMidnight(dateString) {
    const date = new Date(dateString);
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }

  function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = mins.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  useEffect(() => {
    const newMatrix = [];

    for (let i = 0; i < 24 * 60; i += intervalMinutes) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60 === 0 ? "00" : i % 60;
      const nextHour = hours + 1;
      const time = minutes === "00" ? `${hours}:00 - ${nextHour}:00` : false;

      let currRow = time ? [{ time: time }] : [];

      activeSectors.forEach((sector) => {
        currRow.push({ initial: "" });
      });
      newMatrix.push(currRow);
    }

    console.log(newMatrix);

    activeBookings.forEach((booking) => {
      const startMin = getMinutesSinceMidnight(booking.startTime);
      const endMin = getMinutesSinceMidnight(booking.endTime);
      const startRow = startMin / intervalMinutes;
      const endRow = endMin / intervalMinutes;
      let colIndex = -1;

      for (let i = 0; i < activeSectors.length; i++) {
        const curr = activeSectors[i];
        if (curr.id == booking.sector) {
          colIndex = i;
        }
      }

      for (let i = startRow + 1; i < endRow; i++) {
        const currCol = newMatrix[i][newMatrix[i][colIndex].time ? colIndex + 1 : colIndex];
        if (currCol.initial == "") {
          currCol.hide = true;
        }
      }

      newMatrix[startRow][startMin % 60 == 0 ? colIndex + 1 : colIndex] = { initial: booking.initial, rowspan: endRow - startRow, startMin: startMin, endMin: endMin };
    });

    setMatrix(newMatrix);
  }, [activeSectors]);

  const TDComponent = ({ cellIndex, cell }) => {
    if (cell.hide) {
      return null;
    }


    if (cell.initial != "" && cell.rowspan) {
      const sessTimespan = cell.endMin - cell.startMin;
      return (
        <>
          <td className={sessTimespan < 60 ? "bookingCol bookingSmall" : "bookingCol"} key={cellIndex} rowSpan={cell.rowspan}>
            <div className="bookingContent">
              <p>{cell.initial}</p>
              <p>
                {convertMinutesToTime(cell.startMin)} - {convertMinutesToTime(cell.endMin)}
              </p>
            </div>
          </td>
        </>
      );
    }

    if (cell.time) {
      return (
        <td key={cellIndex} rowSpan={60 / intervalMinutes}>
          {<span>{cell.time}</span>}
        </td>
      );
    } else {
      return <td key={cellIndex}>{<span></span>}</td>;
    }
  };

  return (
    <>
      {loading ? (
        <Loading message="Loading sectors..." />
      ) : (
        <div className="booking-table-container">
          <table id="table" className="booking-table">
            <thead>
              <tr>
                <th rowSpan="2">UTC Idő</th>
                {activeSectors.map((sector) => (
                  <th key={sector.id} colSpan={sector.childElements.length}>
                    {sector.id}
                  </th>
                ))}
              </tr>
              <tr>{activeSectors.map((sector) => sector.childElements.map((child) => <th key={child}>{child}</th>))}</tr>
            </thead>
            <tbody id="table-body">
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TDComponent cellIndex={cellIndex} cell={cell} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default BookingTable;
