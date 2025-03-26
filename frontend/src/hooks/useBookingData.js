import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

export default function useBookingData(reloadBookings, selectedDate) {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings`);
        setBookingData(response.data.Bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookingData();
  }, [reloadBookings, selectedDate]);

  return bookingData;
}
