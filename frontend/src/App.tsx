import BookingTable from "./components/BookingTable";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import EventContext from "./context/EventContext";
import useEventData from "./hooks/useEventData";

export default function App() {
  const { events, eventDates, eventsLoading } = useEventData();

  return (
    <EventContext.Provider value={{ events, eventDates, eventsLoading }}>
      <div className="pt-[30px]">
        <BookingTable />
      </div>
    </EventContext.Provider>
  );
}
