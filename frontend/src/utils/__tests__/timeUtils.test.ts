/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import {
  minutesFromMidnight,
  formatBookingTime,
  calculateMinutesBetween,
} from "../timeUtils.ts";

describe("minutesFromMidnight", () => {
  it("calculates correct minutes from midnight (UTC)", () => {
    const result = minutesFromMidnight("2025-04-01T10:30:00Z");
    expect(result).toBe(630); // 10 * 60 + 30
  });

  it("returns 0 for midnight", () => {
    expect(minutesFromMidnight("2025-04-01T00:00:00Z")).toBe(0);
  });
});

describe("formatBookingTime", () => {
  it("formats time to HH:MM in UTC", () => {
    const result = formatBookingTime("2025-04-01T09:05:00Z");
    expect(result).toBe("09:05");
  });

  it("pads single-digit hours and minutes", () => {
    const result = formatBookingTime("2025-04-01T04:07:00Z");
    expect(result).toBe("04:07");
  });
});

describe("calculateMinutesBetween", () => {
  it("returns difference in minutes between two times", () => {
    const result = calculateMinutesBetween(
      "2025-04-01T10:00:00Z",
      "2025-04-01T11:30:00Z",
    );
    expect(result).toBe(90);
  });

  it("returns 0 if times are equal", () => {
    const result = calculateMinutesBetween(
      "2025-04-01T10:00:00Z",
      "2025-04-01T10:00:00Z",
    );
    expect(result).toBe(0);
  });

  it("returns negative if end is before start", () => {
    const result = calculateMinutesBetween(
      "2025-04-01T11:00:00Z",
      "2025-04-01T10:00:00Z",
    );
    expect(result).toBe(-60);
  });
});
