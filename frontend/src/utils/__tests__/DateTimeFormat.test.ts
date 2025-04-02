/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import dateTimeFormat from "../DateTimeFormat.ts";

describe("DateTimeFormat", () => {
  it("Formats the date", () => {
    const result = dateTimeFormat("2025-04-01T12:34:56.789Z");
    expect(result).toEqual("2025-04-01");
  });
});
