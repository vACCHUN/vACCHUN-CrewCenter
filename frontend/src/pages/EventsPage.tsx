import Nav from "../components/Nav";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import config from "../config";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
const API_URL = config.API_URL;
import EventTable from "../components/AdminPage/EventTable";
import useEventData from "../hooks/useEventData";

export default function FilesPage() {
  const [loading, setLoading] = useState(false);
  const { events, eventsLoading } = useEventData();

  return (
    <>
      <Nav />

      <div className="py-8 px-3">{eventsLoading ? <Loading message="Loading events..."></Loading> : <EventTable customEvents={events} reloadEvents={() => {}} adminView={false}></EventTable>}</div>
    </>
  );
}
