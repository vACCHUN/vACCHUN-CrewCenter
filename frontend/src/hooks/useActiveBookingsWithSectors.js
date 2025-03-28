// hooks/useActiveBookingsWithSectors.js
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
const API_URL = config.API_URL;

function useActiveBookingsWithSectors(bookingData, selectedDate, reloadTrigger = false) {
  const [activeBookings, setActiveBookings] = useState([]);
  const [activeBookingsLoading, setActiveBookingsLoading] = useState([]);

  useEffect(() => {
    const fetchActiveSectors = async () => {
      try {
        setActiveBookingsLoading(true);
        const sectorsResponse = await axios.get(`${API_URL}/sectors`);
        const sectors = sectorsResponse.data.Sectors || [];

        if (bookingData) {
          const filtered = bookingData.filter((booking) => {
            const bookingDate = new Date(booking.startTime).toISOString().split("T")[0];
            return bookingDate === selectedDate;
          });

          const enriched = filtered.map((booking) => {
            const sectorInfo = sectors.find((s) => s.id === booking.sector);
            return { ...booking, sectorInfo: sectorInfo || {} };
          });

          setActiveBookings(enriched);
        } else {
          setActiveBookings([]);
        }
      } catch (error) {
        console.error("Error fetching sectors:", error);
      } finally {
        setActiveBookingsLoading(false);
      }
    };

    fetchActiveSectors();
  }, [bookingData, selectedDate, reloadTrigger]);

  return {activeBookings, activeBookingsLoading};
}

export default useActiveBookingsWithSectors;
