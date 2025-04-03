import axios from "axios";
import config from "../config";
import { BookingData } from "../types/booking";
import { throwError } from "./throwError";
const API_URL = config.API_URL;

export async function validateBookingData(bookingData: BookingData, editID: number) {
  const missingFields = isMissingData(bookingData);

  const invalidDates = isInvalidDate(bookingData);
  const overlapping = await isOverlapping(bookingData, editID);

  const notFiveMinuteIntervals = isNotFiveMinuteIntervals(bookingData);
  const outOfRange = isOutOfRange(bookingData);

  const isValid = !missingFields && !invalidDates && !overlapping && !notFiveMinuteIntervals && !outOfRange;

  return { isValid, missingFields, invalidDates, overlapping, notFiveMinuteIntervals, outOfRange };
}

export function isNotFiveMinuteIntervals(bookingData: BookingData) {
  const startMinute = bookingData.startMinute;
  const endMinute = bookingData.endMinute;

  return startMinute % 5 != 0 || endMinute % 5 != 0;
}

export function isOutOfRange(bookingData: BookingData) {
  const startMinute = bookingData.startMinute;
  const endMinute = bookingData.endMinute;
  const startHour = bookingData.startHour;
  const endHour = bookingData.endHour;

  if (startMinute < 0 || startMinute > 55 || endMinute < 0 || endMinute > 55) {
    return true;
  }

  if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
    return true;
  }

  return false;
}

export const isMissingData = (bookingData: BookingData) => {
  if (!bookingData.startDate || !bookingData.endDate || bookingData.startHour === undefined || bookingData.startMinute === undefined || bookingData.endHour === undefined || bookingData.endMinute === undefined || !bookingData.sector || !bookingData.subSector || bookingData.sector === "none" || bookingData.subSector === "none") {
    return true;
  }
  return false;
};

export const isInvalidDate = (bookingData: BookingData) => {
  const { startDate, endDate, startHour, startMinute, endHour, endMinute } = bookingData;

  if (!startDate || !endDate || startHour === undefined || startMinute === undefined || endHour === undefined || endMinute === undefined) {
    return true;
  }

  const parseDateTime = (dateStr: string, hour: number, minute: number) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute));
  };

  const startDateTime = parseDateTime(startDate, startHour, startMinute);
  const endDateTime = parseDateTime(endDate, endHour, endMinute);
  const nowUTC = new Date();

  return startDateTime < nowUTC || endDateTime < nowUTC || startDateTime >= endDateTime;
};

export const isOverlap = (newStart: Date, newEnd: Date, existingStart: Date, existingEnd: Date) => {
  return newStart < existingEnd && newEnd > existingStart;
};

export const isOverlapping = async (bookingData: BookingData, editID?: number): Promise<boolean> => {
  const parseDateTime = (date: string, hour: number, minute: number): Date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute));
  };

  const parseISOString = (iso: string): Date => {
    const [date, time] = iso.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute));
  };


  try {
    const response = await axios.get(`${API_URL}/bookings/day/${bookingData.startDate}`);
    const bookings = response.data.Bookings;

    const newStart = parseDateTime(bookingData.startDate, bookingData.startHour, bookingData.startMinute);
    const newEnd = parseDateTime(bookingData.endDate, bookingData.endHour, bookingData.endMinute);

    return bookings.some((booking: any) => {
      const isCreating = !editID;
      const isEditingOther = editID && editID !== booking.id;

      const sameSector = booking.sector === bookingData.sector && booking.subSector === bookingData.subSector;

      if ((isCreating || isEditingOther) && sameSector) {
        const existingStart = parseISOString(booking.startTime);
        const existingEnd = parseISOString(booking.endTime);

        return isOverlap(newStart, newEnd, existingStart, existingEnd);
      }

      return false;
    });
  } catch (error) {
    throwError("Error checking overlap:", error);
    return false;
  }
};
