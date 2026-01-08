import axios, { AxiosResponse } from "axios";
import config from "../config.ts";
import { BookingData, BookingEditData } from "../types/booking.ts";
import { VatsimUser, User } from "../types/users.ts";
import api from "../axios.ts";
const API_URL = config.API_URL;

type CreateOrUpdateBookingParams = {
  bookingData: BookingData;
  editID?: number;
  userData: VatsimUser;
  userlist: User[];
  bookingToEdit?: BookingEditData | null;
};

export async function deleteBooking(bookingID: number, accessToken?: string): Promise<AxiosResponse | void> {
  if (!bookingID) return;

  const response = await api.delete(`/bookings/delete/${bookingID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export function convertToBackendFormat(inputData: BookingData) {
  const { startDate, endDate, startHour, startMinute, endHour, endMinute, sector, subSector, is_exam } = inputData;
  const pad = (num: number) => num.toString().padStart(2, "0");

  return {
    sector,
    subSector,
    startTime: `${startDate} ${pad(startHour)}:${pad(startMinute)}:00.000000`,
    endTime: `${endDate} ${pad(endHour)}:${pad(endMinute)}:00.000000`,
    is_exam,
  };
}

export async function createOrUpdateBooking({ bookingData, editID = -1, userData, userlist, bookingToEdit }: CreateOrUpdateBookingParams, accessToken?: string) {
  const formatted = convertToBackendFormat(bookingData);
  let finalPayload = {};

  if (editID != -1 && bookingToEdit) {
    // Edited booking
    finalPayload = {
      ...formatted,
      name: bookingToEdit.name,
      cid: bookingToEdit.cid,
      initial: bookingToEdit.initial,
    };
  } else {
    // New booking
    const eventManagerInitial = bookingData.eventManagerInitial || "self";
    const user = userlist.find((u) => u.initial === eventManagerInitial);

    let fetchedInitial = eventManagerInitial === "self" ? userlist.find((u) => u.CID == userData.cid)?.initial : "";

    finalPayload = {
      ...formatted,
      name: eventManagerInitial === "self" ? userData.personal.name_full : user?.name,
      cid: eventManagerInitial === "self" ? userData.cid : user?.CID,
      initial: eventManagerInitial === "self" ? fetchedInitial : user?.initial,
    };
  }

  if (editID != -1) {
    return api.put(`/bookings/update/${editID}`, finalPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } else {
    console.log(finalPayload);
    return api.post(`/bookings/add`, finalPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
