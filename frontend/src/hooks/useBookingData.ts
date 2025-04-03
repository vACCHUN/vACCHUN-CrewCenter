import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";

const API_URL = config.API_URL;

export default function useBookingData(reloadBookings: number, selectedDate: string) {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings`);
        setBookingData(response.data.Bookings);
      } catch (error) {
        throwError("Error fetching booking data: ", error)
      }
    };

    fetchBookingData();
  }, [reloadBookings, selectedDate]);

  return bookingData;
}
