import React from "react";
import dateTimeFormat from "../../utils/DateTimeFormat";
import DatePicker from "react-datepicker";

function DaySelector({ selectedDate, setSelectedDate, eventDates, eventsLoading }) {
  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(dateTimeFormat(date));
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(dateTimeFormat(date));
  };

  return (
    <div className="font-bold px-4 md:pl-7 flex flex-col md:flex-row gap-2 items-center justify-center md:justify-start text-center md:text-left">
      Beültetés ATS
      <div className="flex gap-1 items-center">
        <i className="fa-regular fa-calendar"></i>
        {eventsLoading ? <>Loading events...</> : <DatePicker dateFormat="yyyy-MM-dd" calendarStartDay={1} selected={selectedDate} onChange={(date) => setSelectedDate(dateTimeFormat(date))} highlightDates={eventDates} />}
      </div>
      <div className="flex gap-2">
        <i onClick={handlePrevDay} className="fa-solid fa-circle-left cursor-pointer"></i>
        <i onClick={handleNextDay} className="fa-solid fa-circle-right cursor-pointer"></i>
      </div>
    </div>
  );
}

export default DaySelector;
