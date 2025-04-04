import { useContext } from "react";
import DatePicker from "react-datepicker";
import EventContext from "../context/EventContext";

type CalendarSelectorParams = {
  selected: string;
  onChange: (date: Date | null) => void;
  calendarVisible?: boolean;
};

function CalendarSelector({ selected, onChange, calendarVisible = true }: CalendarSelectorParams) {
  const eventCtx = useContext(EventContext);
  if (!eventCtx) throw new Error("EventContext is not available");

  const { eventDates, eventsLoading } = eventCtx;

  return (
    <>
      {calendarVisible ? <i className="fa-regular fa-calendar"></i> : <></>}

      {eventsLoading ? "Events loading..." : <DatePicker dateFormat="yyyy-MM-dd" calendarStartDay={1} selected={new Date(selected)} onChange={onChange} highlightDates={eventDates} />}
    </>
  );
}

export default CalendarSelector;
