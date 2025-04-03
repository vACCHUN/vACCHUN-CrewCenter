import React, { useContext } from "react";
import { minutesFromMidnight } from "../../utils/timeUtils";
import AuthContext from "../../context/AuthContext.tsx";
import { formatBookingTime, calculateMinutesBetween } from "../../utils/timeUtils";

function BookingTableActiveBookings({ activeBookings, cols, activeSectors, setEditOpen }) {
  const { userData, isAdmin } = useContext(AuthContext);

  return activeBookings.map((booking, key) => {
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

    const bookingLengthMinutes = calculateMinutesBetween(booking.startTime, booking.endTime);
    const formattedStart = formatBookingTime(booking.startTime);
    const formattedEnd = formatBookingTime(booking.endTime);

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
        <div className="leading-[25px]" style={{ fontSize: `${fontSizeTime}px`, marginTop: "auto" }}>{`${formattedStart} ${formattedEnd}`}</div>
        <div className="booking-hover">{booking.name} {formattedStart}-{formattedEnd} {bookingLengthMinutes}p</div>
      </div>
    );
  });
}

export default BookingTableActiveBookings;
