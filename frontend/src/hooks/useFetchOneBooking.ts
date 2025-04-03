import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { throwError } from "../utils/throwError";
const API_URL = config.API_URL;

function useFetchOneBooking(editID: number) {
  const [bookingToEdit, setBookingToEdit] = useState(false);
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
          throwError("Error while fetching booking: ", error);
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
