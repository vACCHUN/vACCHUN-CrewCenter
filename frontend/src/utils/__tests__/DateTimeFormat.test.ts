/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { dateTimeFormat } from "../DateTimeFormat.ts";

describe("DateTimeFormat", () => {
  it("Formats the date", () => {
    const date = new Date("2025-04-01");
    const result = dateTimeFormat(date);
    expect(result).toEqual("2025-04-01");
  });
});
