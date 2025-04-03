/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect, beforeEach } from "vitest";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import config from "../../config.ts";
import { getSectorsByMinRating, getAllSectors } from "../sectorUtils.ts";

const API_URL = config.API_URL;

const mock = new AxiosMockAdapter(axios);

const mockSectors = ["ADC", "TWR", "GND", "ADC", "DEL"];

beforeEach(() => {
  mock.reset();
});

describe("getSectorsByMinRating", () => {
  it("returns unique sectors", async () => {
    const minrating = 3
    mock.onGet(`${API_URL}/sectors/minRating/${minrating}`).reply(200, {
      Sectors: mockSectors,
    });

    const result = await getSectorsByMinRating(3);
    expect(result).toEqual(["ADC", "TWR", "GND", "DEL"]);
  });
});

describe("getAllSectors", () => {
  it("returns all sectors from API", async () => {
    mock.onGet(`${API_URL}/sectors`).reply(200, {
      Sectors: ["ADC", "TWR", "GND"],
    });

    const result = await getAllSectors();
    expect(result).toEqual(["ADC", "TWR", "GND"]);
  });
});
