import { minutesFromMidnight } from "../../utils/timeUtils.ts";
import { formatBookingTime, calculateMinutesBetween } from "../../utils/timeUtils.ts";
import { Booking } from "../../types/booking.ts";
import { Sector } from "../../types/sectors.ts";
import useAuth from "../../hooks/useAuth.ts";
import { throwError } from "../../utils/throwError.ts";

type BookingTableActiveBookingsParams = {
  activeBookings: Booking[];
  cols: string[];
  activeSectors: Sector[];
  setEditOpen: (id: number) => void;
};

function BookingTableActiveBookings({ activeBookings, cols, activeSectors, setEditOpen }: BookingTableActiveBookingsParams) {
  const { userData, isAdmin } = useAuth();
  if (!userData) return throwError("No userdata", "unknown");

  return activeBookings.map((booking) => {
    let startRow = minutesFromMidnight(booking.startTime) / 5 + 24;
    let endRow = minutesFromMidnight(booking.endTime) / 5 + 24;
    let column = cols.indexOf(`${booking.sector}/${booking.subSector}`) + 2;
    let editable = userData.cid == booking.cid || isAdmin;
    let isSectorisation = booking.cid == "-1";
    const fontSizeMultiplierInitial = 3.5/Math.sqrt(3*(booking.initial.length));
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
    if (fontSizeInitial > 25) {
      fontSizeInitial = 25;
    }
    if (fontSizeTime > 18) {
      fontSizeTime = 18;
    }

    return (
      <div
        key={`booking-${booking.id}`}
        className={`booking ${booking.training ? "training " : ""} ${endRow - startRow < 9 ? "small " : ""} ${editable && !isSectorisation ? "editable" : ""} ${classToAdd} ${isSectorisation ? "sectorisation" : ""}`}
        style={{
          gridRowStart: startRow,
          gridRowEnd: endRow,
          gridColumnStart: column,
          gridColumnEnd: column + 1,
        }}
        onClick={() => {
          editable && !isSectorisation ? setEditOpen(booking.id) : "";
        }}
      >
        <div style={{ fontSize: `${fontSizeInitial}px` }}>{booking.initial}</div>
        <div className="leading-[25px]" style={{ fontSize: `${fontSizeTime}px`, marginTop: "auto" }}>{`${formattedStart} ${formattedEnd}`}</div>
        <div className="booking-hover">
          {booking.name} {formattedStart}-{formattedEnd} {bookingLengthMinutes}p
        </div>
      </div>
    );
  });
}

export default BookingTableActiveBookings;
