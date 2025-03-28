import React, { useContext } from "react";
import useCurrentEvent from "../../hooks/useCurrentEvent";
import EventContext from "../../context/EventContext";
import DaySelector from "./DaySelector";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function BookingTableMenubar({ selectedDate, setSelectedDate }) {
  const { events, eventDates, eventsLoading } = useContext(EventContext);

  const currentEvent = useCurrentEvent(selectedDate, events);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0">
      <DaySelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} eventDates={eventDates} eventsLoading={eventsLoading} />

      <div className="flex justify-center md:justify-end px-4 md:px-3 md:col-span-2 text-center md:text-right">
        <p>
          {DAYS[new Date(selectedDate).getDay()]} - {currentEvent}
        </p>
      </div>
    </div>
  );
}

export default BookingTableMenubar;
