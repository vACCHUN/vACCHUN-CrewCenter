import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

export async function deleteBooking(bookingID) {
  if (!bookingID) return;

  try {
    const response = await axios.delete(`${API_URL}/bookings/delete/${bookingID}`);
    return response;
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw error;
  }
}