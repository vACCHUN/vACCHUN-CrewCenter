import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { parseISO } from "date-fns";

const API_URL = config.API_URL;

function useEventData(reloadBookings) {
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        const eudEvents = response.data.data;

        if (Array.isArray(eudEvents)) {
          const LHCCEvents = eudEvents.filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")));

          const dates = LHCCEvents.map((event) => parseISO(event.start_time));

          setEvents(LHCCEvents);
          setEventDates(dates);
        } else {
          console.error("Error: response.data.data is not an array");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventData();
  }, [reloadBookings]);

  return { events, eventDates };
}

export default useEventData;
