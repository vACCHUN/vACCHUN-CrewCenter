import { dateTimeFormat, convertToDate } from "../../utils/DateTimeFormat";
import CalendarSelector from "../CalendarSelector";

type DaySelectorParams = {
  selectedDate: string;
  setSelectedDate: (newdate: string) => void;
};

function DaySelector({ selectedDate, setSelectedDate }: DaySelectorParams) {
  const handlePrevDay = () => {
    const date = convertToDate(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(dateTimeFormat(date));
  };

  const handleNextDay = () => {
    const date = convertToDate(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(dateTimeFormat(date));
  };

  return (
    <div className="font-bold px-4 md:pl-7 flex flex-col md:flex-row gap-2 items-center justify-center md:justify-start text-center md:text-left">
      Beültetés ATS
      <div className="flex gap-1 items-center">
        <CalendarSelector
          calendarVisible={false}
          selected={convertToDate(selectedDate)}
          onChange={(date) => {
            if (date) setSelectedDate(dateTimeFormat(date));
          }}
        />
      </div>
      <div className="flex gap-2">
        <i onClick={handlePrevDay} className="fa-solid fa-circle-left cursor-pointer"></i>
        <i onClick={handleNextDay} className="fa-solid fa-circle-right cursor-pointer"></i>
      </div>
    </div>
  );
}

export default DaySelector;
