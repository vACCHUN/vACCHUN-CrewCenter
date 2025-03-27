import React, { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
const API_URL = config.API_URL;

function useFetchOneBooking(editID) {
  const [bookingToEdit, setBookingToEdit] = useState([]);
  const [bookingToEditLoading, setBookingToEditLoading] = useState(false);
  useEffect(() => {
    const fetchOneBooking = async () => {
      if (editID) {
        setBookingToEditLoading(true);
        try {
          const response = await axios.get(`${API_URL}/bookings/id/${editID}`);
          const booking = response.data.Bookings[0];
          setBookingToEdit(booking);
        } catch (error) {
          console.error(error);
        } finally {
          setBookingToEditLoading(false);
        }
      }
    };

    fetchOneBooking();
  }, [editID]);

  return {bookingToEdit, bookingToEditLoading}
}

export default useFetchOneBooking;
