import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import config from "../config";
import { parseISO } from "date-fns";
import { throwError } from "../utils/throwError";
import { VatsimEvent } from "../types/events";

const API_URL = config.API_URL;

function useEventData() {
  const [events, setEvents] = useState<VatsimEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setEventsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/events`);
        const LHCCEvents = response.data;

        if (Array.isArray(LHCCEvents)) {
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
