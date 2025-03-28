import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import EventContext from "../context/EventContext";

function CalendarSelector({ selected, onChange, calendarVisible = true }) {
  const { events, eventDates, eventsLoading } = useContext(EventContext);

  return (
    <>
      {calendarVisible ? <i className="fa-regular fa-calendar"></i> : <></>}

      {eventsLoading ? "Events loading..." : <DatePicker dateFormat="yyyy-MM-dd" calendarStartDay={1} selected={selected} onChange={onChange} highlightDates={eventDates} />}
    </>
  );
}

export default CalendarSelector;
