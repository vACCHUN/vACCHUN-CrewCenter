import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { CustomVatsimEvent } from "../types/events";
import useAuth from "./useAuth";

const API_URL = config.API_URL;

function useCustomEvents() {
  const [events, setEvents] = useState<CustomVatsimEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const { userData } = useAuth();

  const fetchCustomEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events/custom-events`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });
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

  useEffect(() => {
    fetchCustomEvents();
  }, []);

  const reloadEvents = () => {
    fetchCustomEvents();
  };

  return { events, eventsLoading, reloadEvents };
}

export default useCustomEvents;
