import { Booking } from "../types/booking";

function getBookedSectors(bookings: Booking[], selectedDate: string) {
  const booked = new Set();

  bookings.forEach((booking) => {
    const bookingStart = booking.startTime.split("T")[0];
    const key = `${booking.sector}/${booking.subSector}`;

    if (bookingStart === selectedDate) {
      booked.add(key);
    }
  });

  return Array.from(booked);
}

export default getBookedSectors;