/// <reference types="vitest" />
/// <reference types="vite/client" />
/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import useVisitors from "../useVisitors";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Visitor } from "../../types/atco";
import "@testing-library/jest-dom/vitest";
import config from "../../config";
import { mockVisitors } from "../../__mocks__/mockuser";
const API_URL = config.API_URL;

const mock = new AxiosMockAdapter(axios);



const sendError = vi.fn();
const sendInfo = vi.fn();

vi.mock("../../utils/throwError", () => ({
  throwError: vi.fn(),
}));

beforeEach(() => {
  mock.reset();
  sendError.mockClear();
  sendInfo.mockClear();
});

describe("useVisitors", async () => {
  it("Fetches visitors on mount", async () => {
    mock.onGet(`${API_URL}/visitors`).reply(200, { visitors: mockVisitors, count: mockVisitors.length });

    const { result } = renderHook(() => useVisitors(sendError, sendInfo));

    await waitFor(() => {
      expect(result.current.visitors).toEqual(mockVisitors);
      expect(result.current.visitorsCount).toEqual(mockVisitors.length);
      expect(result.current.loading).toEqual(false);
    });
  });

  it("Handles fetch error", async () => {
    mock.onGet(`${API_URL}/visitors`).networkError();

    renderHook(() => useVisitors(sendError, sendInfo));

    await waitFor(() => {
      expect(sendError).toHaveBeenCalledWith("Error fetching visitors");
    });
  });

  it("Deletes visitor, and updates state", async () => {
    const deleteCID = "11234143";

    mock.onGet(`${API_URL}/visitors`).reply(200, { visitors: mockVisitors, count: mockVisitors.length });

    mock.onDelete(`${API_URL}/visitors/delete/${deleteCID}`).reply(200, []);

    const { result } = renderHook(() => useVisitors(sendError, sendInfo));

    await result.current.deleteVisitor(deleteCID);

    await waitFor(() => {
      expect(result.current.visitorsCount).toEqual(mockVisitors.length - 1);
      expect(result.current.visitors).toEqual(mockVisitors.filter((v) => v.cid != deleteCID));
      expect(result.current.loading).toEqual(false);
    });
  });

  it("Handles delete error", async () => {
    mock.onGet(`${API_URL}/visitors`).reply(200, { visitors: mockVisitors, count: mockVisitors.length });
    mock.onDelete(`${API_URL}/visitors/delete/123`).networkError();

    const { result } = renderHook(() => useVisitors(sendError, sendInfo));

    await result.current.deleteVisitor("123");
    await waitFor(() => {
      expect(sendError).toHaveBeenCalledWith("Error while deleting visitor.");
    });
  });

  it("Handles non existent cid", async () => {
    const deleteCID = "123";

    mock.onGet(`${API_URL}/visitors`).reply(200, { visitors: mockVisitors, count: mockVisitors.length });

    mock.onDelete(`${API_URL}/visitors/delete/${deleteCID}`).reply(200, []);

    const { result } = renderHook(() => useVisitors(sendError, sendInfo));

    await result.current.deleteVisitor(deleteCID);

    await waitFor(() => {
      expect(result.current.visitorsCount).toEqual(mockVisitors.length);
      expect(result.current.visitors).toEqual(mockVisitors);
      expect(result.current.loading).toEqual(false);
    });
  });
});
