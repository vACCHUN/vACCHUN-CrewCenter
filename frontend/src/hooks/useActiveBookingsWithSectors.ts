import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { Booking } from "../types/booking";
import { Sector } from "../types/sectors";
import useAuth from "./useAuth";
import api from "../axios";
const API_URL = config.API_URL;

function useActiveBookingsWithSectors(bookingData: Booking[], selectedDate: string, reloadTrigger?: number) {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [activeBookingsLoading, setActiveBookingsLoading] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchActiveSectors = async () => {
      try {
        setActiveBookingsLoading(true);
        const sectorsResponse = await api.get(`/sectors`, {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });
        const sectors: Sector[] = sectorsResponse.data.Sectors || [];

        if (bookingData) {
          const filtered: Booking[] = bookingData.filter((booking) => {
            const bookingDate = new Date(booking.startTime).toISOString().split("T")[0];
            return bookingDate === selectedDate;
          });

          const enriched = filtered.map((booking) => {
            const sectorInfo = sectors.find((s) => s.id == booking.sector);
            return { ...booking, sectorInfo: sectorInfo || {} };
          });

          setActiveBookings(enriched);
        } else {
          setActiveBookings([]);
        }
      } catch (error) {
        throwError("Error fetching active sectors:", error);
      } finally {
        setActiveBookingsLoading(false);
      }
    };

    fetchActiveSectors();
  }, [bookingData, selectedDate, reloadTrigger]);

  return { activeBookings, activeBookingsLoading };
}

export default useActiveBookingsWithSectors;
