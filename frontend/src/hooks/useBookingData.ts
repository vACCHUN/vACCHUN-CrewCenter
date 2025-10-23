import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import useAuth from "./useAuth";

const API_URL = config.API_URL;

export default function useBookingData(reloadBookings: number, selectedDate: string) {
  const [bookingData, setBookingData] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });
        setBookingData(response.data.Bookings);
      } catch (error) {
        throwError("Error fetching booking data: ", error);
      }
    };

    fetchBookingData();
  }, [reloadBookings, selectedDate]);

  return bookingData;
}
