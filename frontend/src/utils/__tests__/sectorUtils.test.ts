/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect, beforeEach } from "vitest";
import api from "../../axios.ts";
import AxiosMockAdapter from "axios-mock-adapter";
import config from "../../config.ts";
import { getSectorsByMinRating, getAllSectors } from "../sectorUtils.ts";

const mock = new AxiosMockAdapter(api);

const mockSectors = ["ADC", "TWR", "GND", "ADC", "DEL"];

beforeEach(() => {
  mock.reset();
});

describe("getSectorsByMinRating", () => {
  it("returns unique sectors", async () => {
    const minrating = 3;
    mock.onGet(`/sectors/minRating/${minrating}`).reply(200, {
      Sectors: mockSectors,
    });

    const result = await getSectorsByMinRating(3);
    expect(result).toEqual(["ADC", "TWR", "GND", "DEL"]);
  });
});

describe("getAllSectors", () => {
  it("returns all sectors from API", async () => {
    mock.onGet(`/sectors`).reply(200, {
      Sectors: ["ADC", "TWR", "GND"],
    });

    const result = await getAllSectors();
    expect(result).toEqual(["ADC", "TWR", "GND"]);
  });
});
