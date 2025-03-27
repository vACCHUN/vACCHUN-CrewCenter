import { useEffect, useState } from "react";

export default function useCurrentEvent(selectedDate, events) {
  const [currentEvent, setCurrentEvent] = useState("No event");

  useEffect(() => {
    if (!selectedDate || !events) return;

    const dateOnly = (dateTime) => dateTime.split("T")[0];

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
      setCurrentEvent(formattedEvent);
    } else {
      setCurrentEvent("No event");
    }
  }, [selectedDate, events]);

  return currentEvent;
}
