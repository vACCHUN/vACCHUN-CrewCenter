import React, { useContext, useState } from "react";
import useCurrentEvent from "../../hooks/useCurrentEvent";
import EventContext from "../../context/EventContext";
import DaySelector from "./DaySelector";
import { convertToDate } from "../../utils/DateTimeFormat";
import EventDetails from "./EventDetails";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type BookingTableMenubarParams = {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

function BookingTableMenubar({ selectedDate, setSelectedDate }: BookingTableMenubarParams) {
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);

  const eventCtx = useContext(EventContext);
  if (!eventCtx) throw new Error("EventContext is not available");

  const { events } = eventCtx;

  const currentEvent = useCurrentEvent(selectedDate, events);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0">
        <DaySelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        <div className="flex justify-center md:justify-end px-4 md:px-3 md:col-span-2 text-center md:text-right">
          <button
            className={currentEvent.event != null ? "hover:underline" : ""}
            onClick={() => {
              if (currentEvent.event != null) setEventDetailsOpen(true);
            }}
          >
            {DAYS[convertToDate(selectedDate).getDay()]} - {currentEvent.message}
          </button>
        </div>
      </div>
      {eventDetailsOpen && currentEvent.event != null ? <EventDetails event={currentEvent.event} message={currentEvent.message} closeModal={() => setEventDetailsOpen(false)} /> : <></>}
    </>
  );
}

export default BookingTableMenubar;
