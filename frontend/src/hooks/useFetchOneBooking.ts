import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import { throwError } from "../utils/throwError";
import { Booking } from "../types/booking";
import useAuth from "./useAuth";
import api from "../axios";
const API_URL = config.API_URL;

function useFetchOneBooking(editID: number) {
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [bookingToEditLoading, setBookingToEditLoading] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchOneBooking = async () => {
      if (editID) {
        setBookingToEditLoading(true);
        try {
          const response = await api.get(`/bookings/id/${editID}`, {
            headers: {
              Authorization: `Bearer ${userData?.access_token}`,
            },
          });
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

  return { bookingToEdit, bookingToEditLoading };
}

export default useFetchOneBooking;
