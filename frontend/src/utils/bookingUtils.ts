import axios, { AxiosResponse } from "axios";
import config from "../config.ts";
import { BookingData, BookingEditData } from "../types/booking.ts";
import { VatsimUser, User } from "../types/users.ts";
const API_URL = config.API_URL;

export async function deleteBooking(bookingID: number): Promise<AxiosResponse | void> {
  if (!bookingID) return;

  const response = await axios.delete(`${API_URL}/bookings/delete/${bookingID}`);
  return response;
}

export function convertToBackendFormat(inputData: BookingData) {
  const { startDate, endDate, startHour, startMinute, endHour, endMinute, sector, subSector } = inputData;
  const pad = (num: number) => num.toString().padStart(2, "0");

  return {
    sector,
    subSector,
    startTime: `${startDate} ${pad(startHour)}:${pad(startMinute)}:00.000000`,
    endTime: `${endDate} ${pad(endHour)}:${pad(endMinute)}:00.000000`,
  };
}

type CreateOrUpdateBookingParams = {
  bookingData: BookingData;
  editID?: number | boolean;
  userData: VatsimUser;
  userlist: User[];
  bookingToEdit?: BookingEditData;
};

export async function createOrUpdateBooking({ bookingData, editID, userData, userlist, bookingToEdit }: CreateOrUpdateBookingParams) {
  const formatted = convertToBackendFormat(bookingData);
  let finalPayload = {};

  if (editID && bookingToEdit) {
    finalPayload = {
      ...formatted,
      name: bookingToEdit.name,
      cid: bookingToEdit.cid,
      initial: bookingToEdit.initial,
    };
  } else {
    const eventManagerInitial = bookingData.eventManagerInitial || "self";
    const user = userlist.find((u) => u.initial === eventManagerInitial);

    let initialResponse;
    if (eventManagerInitial === "self") {
      const res = await axios.get(`${API_URL}/atcos/cid/${userData.cid}`);
      initialResponse = res.data.ATCOs[0];
    }

    finalPayload = {
      ...formatted,
      name: eventManagerInitial === "self" ? userData.personal.name_full : user?.name,
      cid: eventManagerInitial === "self" ? userData.cid : user?.CID,
      initial: eventManagerInitial === "self" ? initialResponse.initial : user?.initial,
    };
  }

  if (editID) {
    return axios.put(`${API_URL}/bookings/update/${editID}`, finalPayload);
  } else {
    return axios.post(`${API_URL}/bookings/add`, finalPayload);
  }
}
