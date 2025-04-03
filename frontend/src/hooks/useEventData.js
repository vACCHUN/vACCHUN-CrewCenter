import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import config from "../config";
import { parseISO } from "date-fns";
import { throwError } from "../utils/throwError";

const API_URL = config.API_URL;

function useEventData() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setEventsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/events`);
        const eudEvents = response.data.data;

        if (Array.isArray(eudEvents)) {
          const LHCCEvents = eudEvents.filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")));

          setEvents(LHCCEvents);
        } else {
          console.error("Error: response.data.data is not an array");
        }
      } catch (error) {
        throwError("Error fetching events: ", error);
      }
      setEventsLoading(false);
    };

    fetchEventData();
  }, []);

  const eventDates = useMemo(() => {
    return events.map((event) => parseISO(event.start_time));
  }, [events]);

  return { events, eventDates, eventsLoading };
}

export default useEventData;
