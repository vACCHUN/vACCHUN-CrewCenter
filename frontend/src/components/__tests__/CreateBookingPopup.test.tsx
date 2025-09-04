/// <reference types="vitest" />
/// <reference types="vite/client" />
/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserEditModal from "../UserEditModal";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { User, VatsimUser } from "../../types/users";
import AuthContext from "../../context/AuthContext";
import EventContext from "../../context/EventContext";
import CreateBooking from "../CreateBookingPopup";
import dateTimeFormat from "../../utils/DateTimeFormat";
import { EventContextParams } from "../../types/events";
import { mockEventContext } from "../../__mocks__/event";
import { mockVatsimUser } from "../../__mocks__/mockuser";
import { mockBooking, mockBookingData } from "../../__mocks__/booking";
import { tomorrowNoon } from "../../__mocks__/tomorrow";
import useFetchOneBooking from "../../hooks/useFetchOneBooking";

vi.mock("../../hooks/useFetchOneBooking", () => ({
  default: vi.fn(),
}));

describe("CreateBookingPopup", () => {
  it("renders without edit id", async () => {
    (useFetchOneBooking as any).mockReturnValue({
      bookingToEdit: undefined,
      bookingToEditLoading: false,
    });
    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <EventContext.Provider value={mockEventContext}>
          <CreateBooking closePopup={vi.fn()} />
        </EventContext.Provider>
      </AuthContext.Provider>
    );

    const startHH = screen.getByTestId("startHH");
    const startMM = screen.getByTestId("startMM");
    const endHH = screen.getByTestId("endHH");
    const endMM = screen.getByTestId("endMM");

    await waitFor(() => {
      expect(startHH).toBeInTheDocument();
      expect(startMM).toBeInTheDocument();
      expect(endHH).toBeInTheDocument();
      expect(endMM).toBeInTheDocument();

      const SectorSelector = screen.getByTestId("sectorselector");
      const subSectorSelector = screen.getByTestId("subsectorselector");

      const date = screen.getByDisplayValue(dateTimeFormat(new Date()));

      expect(date).toBeInTheDocument();

      expect(SectorSelector).toBeInTheDocument();
      expect(subSectorSelector).toBeInTheDocument();

      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const SectorSelector = screen.getByTestId("sectorselector");
    const subSectorSelector = screen.getByTestId("subsectorselector");

    expect(startHH).toHaveValue(null);
    expect(startMM).toHaveValue(null);
    expect(endHH).toHaveValue(null);
    expect(endMM).toHaveValue(null);

    expect(SectorSelector).toHaveValue("none");
    expect(subSectorSelector).toHaveValue("none");
  });

  it("renders with editid", async () => {
    (useFetchOneBooking as any).mockReturnValue({
      bookingToEdit: mockBooking,
      bookingToEditLoading: false,
    });
    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <EventContext.Provider value={mockEventContext}>
          <CreateBooking closePopup={vi.fn()} editID={1} />
        </EventContext.Provider>
      </AuthContext.Provider>
    );

    const startHH = screen.getByTestId("startHH");
    const startMM = screen.getByTestId("startMM");
    const endHH = screen.getByTestId("endHH");
    const endMM = screen.getByTestId("endMM");

    await waitFor(() => {
      expect(startHH).toBeInTheDocument();
      expect(startMM).toBeInTheDocument();
      expect(endHH).toBeInTheDocument();
      expect(endMM).toBeInTheDocument();

      const SectorSelector = screen.getByTestId("sectorselector");
      const subSectorSelector = screen.getByTestId("subsectorselector");

      const date = screen.getByDisplayValue("2025-04-10");

      expect(date).toBeInTheDocument();

      expect(SectorSelector).toBeInTheDocument();
      expect(subSectorSelector).toBeInTheDocument();

      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const SectorSelector = screen.getByTestId("sectorselector");
    const subSectorSelector = screen.getByTestId("subsectorselector");

    expect(startHH).toHaveValue(12);
    expect(startMM).toHaveValue(0);
    expect(endHH).toHaveValue(13);
    expect(endMM).toHaveValue(0);

    expect(SectorSelector).toHaveValue("EL");
    expect(subSectorSelector).toHaveValue("EC");
  });
  it("renders with selected date", async () => {
    (useFetchOneBooking as any).mockReturnValue({
      bookingToEdit: undefined,
      bookingToEditLoading: false,
    });
    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <EventContext.Provider value={mockEventContext}>
          <CreateBooking closePopup={vi.fn()} selectedDate="2025-04-12" />
        </EventContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const date = screen.getByDisplayValue("2025-04-12");

      expect(date).toBeInTheDocument();
    });
  });
});
