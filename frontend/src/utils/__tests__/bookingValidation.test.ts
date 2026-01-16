/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect, beforeEach } from "vitest";
import api from "../../axios.ts";
import AxiosMockAdapter from "axios-mock-adapter";
import { BookingData } from "../../types/booking.ts";
import { isNotFiveMinuteIntervals, isOutOfRange, isMissingData, isInvalidDate, isOverlap, isOverlapping } from "../bookingValidation.ts";

const mock = new AxiosMockAdapter(api);

const sampleBookingData: BookingData = {
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

beforeEach(() => {
  mock.reset();
});

describe("isNotFiveMinuteIntervals", () => {
  it("Returns true if given a minute not divisible by 5", () => {
    let result = isNotFiveMinuteIntervals({ ...sampleBookingData, startMinute: 32 });
    expect(result).toBe(true);

    result = isNotFiveMinuteIntervals({ ...sampleBookingData, endMinute: 32 });
    expect(result).toBe(true);

    result = isNotFiveMinuteIntervals({ ...sampleBookingData, endMinute: 32, startMinute: 52 });
    expect(result).toBe(true);
  });

  it("Returns false if given a minute devisible by 5", () => {
    let result = isNotFiveMinuteIntervals({ ...sampleBookingData, startMinute: 30 });
    expect(result).toBe(false);

    result = isNotFiveMinuteIntervals({ ...sampleBookingData, endMinute: 30 });
    expect(result).toBe(false);

    result = isNotFiveMinuteIntervals({ ...sampleBookingData, endMinute: 30, startMinute: 25 });
    expect(result).toBe(false);
  });
});

describe("isOutOfRange", () => {
  it("returns true if minutes are out of range", () => {
    expect(isOutOfRange({ ...sampleBookingData, startMinute: -5 })).toBe(true);
    expect(isOutOfRange({ ...sampleBookingData, endMinute: 60 })).toBe(true);
  });

  it("returns true if hours are out of range", () => {
    expect(isOutOfRange({ ...sampleBookingData, startHour: -1 })).toBe(true);
    expect(isOutOfRange({ ...sampleBookingData, endHour: 24 })).toBe(true);
  });

  it("returns false for valid time values", () => {
    expect(isOutOfRange({ ...sampleBookingData, startHour: 0, endHour: 23, startMinute: 0, endMinute: 55 })).toBe(false);
    expect(isOutOfRange({ ...sampleBookingData, startHour: 12, endHour: 13, startMinute: 5, endMinute: 50 })).toBe(false);
  });
});

describe("isMissingData", () => {
  it("returns true if any required field is missing or 'none'", () => {
    expect(isMissingData({ ...sampleBookingData, startDate: "" })).toBe(true);
    expect(isMissingData({ ...sampleBookingData, sector: "none" })).toBe(true);
    expect(isMissingData({ ...sampleBookingData, subSector: "none" })).toBe(true);
    expect(isMissingData({ ...sampleBookingData, startHour: undefined as any })).toBe(true);
  });

  it("returns false if all required fields are present and valid", () => {
    expect(isMissingData(sampleBookingData)).toBe(false);
    expect(isMissingData({ ...sampleBookingData, startHour: 0, startMinute: 0 })).toBe(false);
  });
});

describe("isInvalidDate", () => {
  const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // Tomorrow
  const dateStr = futureDate.toISOString().split("T")[0];

  it("returns true if start date is missing", () => {
    expect(isInvalidDate({ ...sampleBookingData, startDate: "" })).toBe(true);
  });

  it("returns true if end date is in the past", () => {
    expect(isInvalidDate({ ...sampleBookingData, endDate: "2000-01-01" })).toBe(true);
  });

  it("returns true if start is after end", () => {
    expect(
      isInvalidDate({
        ...sampleBookingData,
        startDate: dateStr,
        endDate: dateStr,
        startHour: 15,
        endHour: 10,
      })
    ).toBe(true);
  });

  it("returns false if both dates are in the future and start < end", () => {
    expect(
      isInvalidDate({
        ...sampleBookingData,
        startDate: dateStr,
        endDate: dateStr,
        startHour: 10,
        endHour: 12,
      })
    ).toBe(false);
  });

  it("returns true if start and end are equal", () => {
    expect(
      isInvalidDate({
        ...sampleBookingData,
        startDate: dateStr,
        endDate: dateStr,
        startHour: 10,
        endHour: 10,
        startMinute: 0,
        endMinute: 0,
      })
    ).toBe(true);
  });
});

describe("isOverlap", () => {
  const toDate = (str: string) => new Date(str);

  it("returns true if new range is inside existing range", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T10:30:00Z");
    const newEnd = toDate("2025-04-01T11:30:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(true);
  });

  it("returns true if new range overlaps the end of existing", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T11:00:00Z");
    const newEnd = toDate("2025-04-01T13:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(true);
  });

  it("returns true if new range starts before and ends during existing", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T09:00:00Z");
    const newEnd = toDate("2025-04-01T11:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(true);
  });

  it("returns false if new range ends exactly at existing start", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T08:00:00Z");
    const newEnd = toDate("2025-04-01T10:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(false);
  });

  it("returns false if new range starts exactly at existing end", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T12:00:00Z");
    const newEnd = toDate("2025-04-01T13:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(false);
  });

  it("returns false if new range is completely before existing", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T08:00:00Z");
    const newEnd = toDate("2025-04-01T09:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(false);
  });

  it("returns false if new range is completely after existing", () => {
    const existingStart = toDate("2025-04-01T10:00:00Z");
    const existingEnd = toDate("2025-04-01T12:00:00Z");
    const newStart = toDate("2025-04-01T13:00:00Z");
    const newEnd = toDate("2025-04-01T14:00:00Z");
    expect(isOverlap(newStart, newEnd, existingStart, existingEnd)).toBe(false);
  });
});

describe("isOverlapping", () => {
  it("returns true when overlap is detected", async () => {
    mock.onGet(`/bookings/day/2025-04-01`).reply(200, {
      Bookings: [
        {
          id: 1,
          sector: "ADC",
          subSector: "ADC",
          startTime: "2025-04-01T11:00",
          endTime: "2025-04-01T13:00",
        },
      ],
    });

    const result = await isOverlapping(sampleBookingData);
    expect(result).toBe(true);
  });

  it("returns false when no overlap is detected", async () => {
    mock.onGet(`/bookings/day/2025-04-01`).reply(200, {
      Bookings: [
        {
          id: 1,
          sector: "ADC",
          subSector: "ADC",
          startTime: "2025-04-01T13:00",
          endTime: "2025-04-01T15:00",
        },
      ],
    });

    const result = await isOverlapping(sampleBookingData);
    expect(result).toBe(false);
  });

  it("ignores same booking ID when editing", async () => {
    mock.onGet(`/bookings/day/2025-04-01`).reply(200, {
      Bookings: [
        {
          id: 123,
          sector: "ADC",
          subSector: "ADC",
          startTime: "2025-04-01T10:00",
          endTime: "2025-04-01T12:00",
        },
      ],
    });

    const result = await isOverlapping(sampleBookingData, 123); // editing same booking
    expect(result).toBe(false);
  });
});
