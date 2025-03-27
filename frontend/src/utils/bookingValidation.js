import axios from "axios";
import config from "../config";
const API_URL = config.API_URL;

export async function validateBookingData(bookingData, editID) {
  const missingFields = isMissingData(bookingData);

  const invalidDates = isInvalidDate(bookingData);
  const overlapping = await isOverlapping(bookingData, editID);

  const isValid = !missingFields && !invalidDates && !overlapping;

  return { isValid, missingFields, invalidDates, overlapping };
}
const isMissingData = (bookingData) => {
  if (!bookingData.startDate || !bookingData.endDate || !bookingData.startHour || !bookingData.startMinute || !bookingData.endHour || !bookingData.endMinute || !bookingData.sector || !bookingData.subSector || bookingData.sector == "none" || bookingData.subSector == "none") {
    return true;
  }
  return false;
};

const isInvalidDate = (bookingData) => {
  if (bookingData.startDate && bookingData.startHour !== undefined && bookingData.startMinute !== undefined && bookingData.endDate && bookingData.endHour !== undefined && bookingData.endMinute !== undefined) {
    const startDateTime = new Date(Date.UTC(parseInt(bookingData.startDate.split("-")[0], 10), parseInt(bookingData.startDate.split("-")[1], 10) - 1, parseInt(bookingData.startDate.split("-")[2], 10), parseInt(bookingData.startHour, 10), parseInt(bookingData.startMinute, 10)));

    const endDateTime = new Date(Date.UTC(parseInt(bookingData.endDate.split("-")[0], 10), parseInt(bookingData.endDate.split("-")[1], 10) - 1, parseInt(bookingData.endDate.split("-")[2], 10), parseInt(bookingData.endHour, 10), parseInt(bookingData.endMinute, 10)));

    const nowUTC = new Date();

    if (startDateTime < nowUTC || endDateTime < nowUTC) {
      return true;
    }

    if (startDateTime >= endDateTime) {
      return true;
    }

    return false;
  } else {
    return true;
  }
};

const isOverlap = (newStart, newEnd, existingStart, existingEnd) => {
  return newStart < existingEnd && newEnd > existingStart;
};

function parseDate(dateTime) {
  const [date, time] = dateTime.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

const isOverlapping = async (bookingData, editID) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/day/${bookingData.startDate}`);
    const bookings = response.data.Bookings;

    const newStart = new Date(Date.UTC(parseInt(bookingData.startDate.split("-")[0], 10), parseInt(bookingData.startDate.split("-")[1], 10) - 1, parseInt(bookingData.startDate.split("-")[2], 10), parseInt(bookingData.startHour, 10), parseInt(bookingData.startMinute, 10)));

    const newEnd = new Date(Date.UTC(parseInt(bookingData.endDate.split("-")[0], 10), parseInt(bookingData.endDate.split("-")[1], 10) - 1, parseInt(bookingData.endDate.split("-")[2], 10), parseInt(bookingData.endHour, 10), parseInt(bookingData.endMinute, 10)));

    let hasOverlap = false;

    for (const booking of bookings) {
      const isCreating = !editID;
      const isEditingOther = editID && editID != booking.id;

      if ((isCreating || isEditingOther) && booking.sector === bookingData.sector && booking.subSector === bookingData.subSector) {
        const existingStart = parseDate(booking.startTime);
        const existingEnd = parseDate(booking.endTime);

        if (isOverlap(newStart, newEnd, existingStart, existingEnd)) {
          hasOverlap = true;
          break;
        }
      }
    }

    return hasOverlap;
  } catch (error) {
    console.error(error);
    return "Error.";
  }
};
