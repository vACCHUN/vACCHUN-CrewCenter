/// <reference types="vitest" />
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { convertToBackendFormat, createOrUpdateBooking } from "../bookingUtils.ts";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import config from "../../config.ts";
import { User, VatsimUser } from "../../types/users.ts";
import { BookingData, BookingEditData } from "../../types/booking.ts";
const API_URL = config.API_URL;

const mock = new AxiosMockAdapter(axios);

const sampleBookingData: BookingData = {
  startDate: "2025-04-01",
  endDate: "2025-04-01",
  startHour: 10,
  endHour: 12,
  startMinute: 30,
  endMinute: 15,
  sector: "ADC",
  subSector: "ADC",
  eventManagerInitial: "TE",
};

describe("convertToBackendFormat", () => {
  it("Converts data to match backend format", () => {
    const expectedResult = {
      sector: "ADC",
      subSector: "ADC",
      startTime: "2025-04-01 10:30:00.000000",
      endTime: "2025-04-01 12:15:00.000000",
    };

    const result = convertToBackendFormat(sampleBookingData);

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
  { CID: 10000010, name: "Web Ten", initial: "TE", isAdmin: true, isInstructor: false, trainee: false },
  { CID: 10000009, name: "Web Nine", initial: "NI", isAdmin: false, isInstructor: false, trainee: false },
];

const sampleBookingToEdit: BookingEditData = {
  startTime: "2025-04-01 15:00:00.000000",
  endTime: "2025-04-01 15:30:00.000000",
  sector: "ADC",
  subSector: "ADC",
  name: "Web Ten",
  cid: 10000010,
  initial: "TE",
  training: 0,
  id: 5
};


describe("createOrUpdateBooking", () => {
  it("Creates new booking with initial", async () => {
    const payload = {
      bookingData: sampleBookingData,
      userData: sampleUserData,
      userlist: sampleUserList,
    };

    mock.onPost(`${API_URL}/bookings/add`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      expect(parsedData.initial).toEqual("TE");
      return [200, {}];
    });

    await createOrUpdateBooking(payload);
  });

  it("Creates new booking with self", async () => {
    const payload = {
      bookingData: { ...sampleBookingData, eventManagerInitial: "self" },
      userData: sampleUserData,
      userlist: sampleUserList,
    };

    mock.onGet(`${API_URL}/atcos/cid/${sampleUserData.cid}`).reply(200, {
      ATCOs: [
        {
          initial: "AA",
        },
      ],
    });

    mock.onPost(`${API_URL}/bookings/add`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      expect(parsedData.initial).toEqual("AA");
      return [200, {}];
    });

    await createOrUpdateBooking(payload);
  });

  it("Edits when editID provided", async () => {
    const payload = {
      bookingData: sampleBookingData,
      userData: sampleUserData,
      userlist: sampleUserList,
      editID: sampleEditId,
      bookingToEdit: sampleBookingToEdit
    };

    mock.onPut(`${API_URL}/bookings/update/${sampleEditId}`).reply((config) => {
      const parsedData = JSON.parse(config.data);
      console.log(parsedData);
      expect(parsedData.initial).toEqual(sampleBookingToEdit.initial);
      expect(parsedData.name).toEqual(sampleBookingToEdit.name);
      expect(parsedData.cid).toEqual(sampleBookingToEdit.cid);
      return [200, {}];
    });

    await createOrUpdateBooking(payload);

  });
});
