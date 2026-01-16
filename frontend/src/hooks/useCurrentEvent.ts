import { useEffect, useState } from "react";
import { VatsimEvent } from "../types/events";
import { convertToDate } from "../utils/DateTimeFormat";

type currentEvent = {
  event: null | VatsimEvent;
  message: string;
};

export default function useCurrentEvent(
  selectedDate: string,
  events: VatsimEvent[],
) {
  const [currentEvent, setCurrentEvent] = useState<currentEvent>({
    event: null,
    message: "No event",
  });

  useEffect(() => {
    if (!selectedDate || !events) return;

    const dateOnly = (dateTime: string) => dateTime.split("T")[0];

    const event = events.find((event) => {
      const eventStartDate = dateOnly(event.start_time);
      return eventStartDate === selectedDate;
    });

    if (event) {
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);

      const startHour = startTime.getUTCHours().toString().padStart(2, "0");
      const startMinute = startTime.getUTCMinutes().toString().padStart(2, "0");
      const endHour = endTime.getUTCHours().toString().padStart(2, "0");
      const endMinute = endTime.getUTCMinutes().toString().padStart(2, "0");

      const formattedEvent = `${startHour}:${startMinute} - ${endHour}:${endMinute} | ${event.name}`;
      setCurrentEvent({ event: event ?? null, message: formattedEvent });
    } else {
      setCurrentEvent({ event: null, message: "No event" });
    }
  }, [selectedDate, events]);

  return currentEvent;
}
