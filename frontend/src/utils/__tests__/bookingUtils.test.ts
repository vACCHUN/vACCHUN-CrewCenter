/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect, beforeEach } from "vitest";
import { deleteBooking, convertToBackendFormat, createOrUpdateBooking } from "../bookingUtils.ts";
import api from "../../axios.ts";
import AxiosMockAdapter from "axios-mock-adapter";
import { User, VatsimUser } from "../../types/users.ts";
import { BookingData, BookingEditData } from "../../types/booking.ts";
import { mockBookingData } from "../../__mocks__/booking.ts";

const mock = new AxiosMockAdapter(api);

beforeEach(() => {
  mock.reset();
});

describe("deleteBooking", () => {
  it("Returns when no bookingID provided", async () => {
    //@ts-ignore
    const result = await deleteBooking();
    expect(result).toBeUndefined();
  });

  it("Returns response when id provided", async () => {
    mock.onDelete(`/bookings/delete/${sampleEditId}`).reply(200, []);
    const result = await deleteBooking(sampleEditId);
    expect(result).toBeDefined();
  });
});

describe("convertToBackendFormat", () => {
  it("Converts data to match backend format", () => {
    const expectedResult = {
      sector: "ADC",
      subSector: "ADC",
      startTime: "2025-04-01 10:30:00.000000",
      endTime: "2025-04-01 12:15:00.000000",
    };

    const result = convertToBackendFormat(mockBookingData);

    expect(result).toEqual(expectedResult);
  });
});

const sampleEditId = 5;
const sampleUserData: VatsimUser = {
  cid: "10000010",
  personal: {
    name_first: "Web",
    name_last: "Ten",
    name_full: "Web Ten",
    email: "auth.dev10@vatsim.net",
  },
  vatsim: {
    rating: {
      id: 12,
      long: "Administrator",
      short: "ADM",
    },
    pilotrating: {
      id: 63,
      long: "Flight Examiner",
      short: "FE",
    },
    division: {
      id: "EUD",
      name: "Europe (except UK)",
    },
    region: {
      id: "EMEA",
      name: "Europe, Middle East and Africa",
    },
    subdivision: {
      id: "FRA",
      name: "France",
    },
  },
  oauth: {
    token_valid: true,
  },
};
const sampleUserList: User[] = [
  { CID: "10000010", name: "Web Ten", initial: "TE", isAdmin: 1, isInstructor: 0, trainee: 0 },
  { CID: "10000009", name: "Web Nine", initial: "NI", isAdmin: 0, isInstructor: 0, trainee: 0 },
];

const sampleBookingToEdit: BookingEditData = {
  startTime: "2025-04-01 15:00:00.000000",
  endTime: "2025-04-01 15:30:00.000000",
  sector: "ADC",
  subSector: "ADC",
  name: "Web Ten",
  cid: "10000010",
  initial: "TE",
  training: 0,
  id: 5,
};

describe("createOrUpdateBooking", () => {
  it("Creates new booking with initial", async () => {
    const payload = {
      bookingData: mockBookingData,
      userData: sampleUserData,
      userlist: sampleUserList,
    };

    mock.onPost(`/bookings/add`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      expect(parsedData.initial).toEqual("TE");
      return [200, {}];
    });
    await createOrUpdateBooking(payload);
  });

  it("Creates new booking with self", async () => {
    const payload = {
      bookingData: { ...mockBookingData, eventManagerInitial: "self" },
      userData: { ...sampleUserData, cid: "10000009" },
      userlist: sampleUserList,
    };

    mock.onPost(`/bookings/add`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      expect(parsedData.initial).toEqual("NI");
      return [200, {}];
    });

    await createOrUpdateBooking(payload);
  });

  it("Edits when editID provided", async () => {
    const payload = {
      bookingData: mockBookingData,
      userData: sampleUserData,
      userlist: sampleUserList,
      editID: sampleEditId,
      bookingToEdit: sampleBookingToEdit,
    };

    mock.onPut(`/bookings/update/${sampleEditId}`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      expect(parsedData.initial).toEqual(sampleBookingToEdit.initial);
      expect(parsedData.name).toEqual(sampleBookingToEdit.name);
      expect(parsedData.cid).toEqual(sampleBookingToEdit.cid);
      return [200, {}];
    });

    await createOrUpdateBooking(payload);
  });
});
