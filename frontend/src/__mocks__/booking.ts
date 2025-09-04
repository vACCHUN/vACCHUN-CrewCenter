import { Booking, BookingData } from "../types/booking";

export const mockBookingData: BookingData = {
  startDate: "2025-04-01",
  endDate: "2025-04-01",
  startHour: 10,
  endHour: 12,
  startMinute: 30,
  endMinute: 15,
  sector: "ADC",
  subSector: "ADC",
  eventManagerInitial: "TE",
};

export const mockBooking: Booking = {
  id: 1,
  initial: "DO",
  cid: "1234567",
  name: "John Doe",
  startTime: "2025-04-10T12:00:00Z",
  endTime: "2025-04-10T13:00:00Z",
  sector: "EL",
  subSector: "EC",
  training: 0,
};