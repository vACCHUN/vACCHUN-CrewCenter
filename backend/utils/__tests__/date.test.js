import { describe, it, expect } from "vitest";
import { isEventBooking } from "../isEventBooking";

describe("isEventBooking", () => {
  it("returns true when booking overlaps with an event", () => {
    const events = [
      {
        start_time: "2026-01-16T10:00:00Z",
        end_time: "2026-01-16T12:00:00Z",
      },
    ];

    const result = isEventBooking("2026-01-16T11:00:00Z", "2026-01-16T13:00:00Z", events);

    expect(result).toBe(true);
  });

  it("returns false when booking does not overlap any event", () => {
    const events = [
      {
        start_time: "2026-01-16T10:00:00Z",
        end_time: "2026-01-16T12:00:00Z",
      },
    ];

    const result = isEventBooking("2026-01-16T12:00:00Z", "2026-01-16T13:00:00Z", events);

    expect(result).toBe(false);
  });

  it("returns true when booking fully inside an event", () => {
    const events = [
      {
        start_time: "2026-01-16T10:00:00Z",
        end_time: "2026-01-16T14:00:00Z",
      },
    ];

    const result = isEventBooking("2026-01-16T11:00:00Z", "2026-01-16T12:00:00Z", events);

    expect(result).toBe(true);
  });

  it("returns false when events array is empty", () => {
    const result = isEventBooking("2026-01-16T11:00:00Z", "2026-01-16T12:00:00Z", []);

    expect(result).toBe(false);
  });
});
