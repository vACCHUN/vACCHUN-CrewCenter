/// <reference types="vitest" />
/// <reference types="vite/client" />

import { describe, it, expect } from "vitest";
import { Booking } from "../../types/booking";
import getBookedSectors from "../getBookedSectors";

const mockBookings: Booking[] = [
  {
    id: 1,
    cid: "1234567",
    name: "Web Ten",
    initial: "TE",
    startTime: "2025-04-01T10:00:00Z",
    endTime: "2025-04-01T12:00:00Z",
    sector: "ADC",
    subSector: "ADC",
    training: 0,
    is_exam: false,
  },
  {
    id: 2,
    cid: "1234568",
    name: "Web Nine",
    initial: "NI",
    startTime: "2025-04-01T14:00:00Z",
    endTime: "2025-04-01T16:00:00Z",
    sector: "TWR",
    subSector: "TWR",
    training: 0,
    is_exam: false,
  },
  {
    id: 3,
    cid: "1234569",
    name: "Web Eight",
    initial: "EI",
    startTime: "2025-04-02T08:00:00Z",
    endTime: "2025-04-02T10:00:00Z",
    sector: "ADC",
    subSector: "ADC",
    training: 0,
    is_exam: false,
  },
];

describe("getBookedSectors", () => {
  it("Returns unique sector/subSector pairs for the selected date", () => {
    const result = getBookedSectors(mockBookings, "2025-04-01");
    expect(result).toEqual(expect.arrayContaining(["ADC/ADC", "TWR/TWR"]));
    expect(result.length).toBe(2);
  });

  it("Returns empty array if no bookings match the date", () => {
    const result = getBookedSectors(mockBookings, "2025-04-03");
    expect(result).toEqual([]);
  });

  it("Does not duplicate sector/subSector pairs", () => {
    const duplicate: Booking = {
      ...mockBookings[0],
      id: 4,
    };

    const result = getBookedSectors([...mockBookings, duplicate], "2025-04-01");
    expect(result).toEqual(expect.arrayContaining(["ADC/ADC", "TWR/TWR"]));
    expect(result.length).toBe(2);
  });
});
