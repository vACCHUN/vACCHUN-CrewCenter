import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";
import Nav from "./components/Nav";
import BookingTable from "./components/BookingTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import config from "./config";
import { parseISO } from "date-fns";
const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;

export default function App() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [bookingData, setBookingData] = useState([]);
  const [loginValid, setLoginValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateTimeFormat(new Date()));
  const [eventDates, setEventDates] = useState([]);
  const [currentEvent, setCurrentEvent] = useState("No event");
  const [events, setEvents] = useState();
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        const eudEvents = response.data.data;

        if (Array.isArray(eudEvents)) {
          const LHCCEvents = eudEvents.filter((event) => event.airports.some((airport) => airport.icao.startsWith("LH")));

          let dates = [];
          setEvents(LHCCEvents);

          LHCCEvents.forEach((event) => {
            dates.push(parseISO(event.start_time));
          });
          setEventDates(dates);
        } else {
          console.error("Error: response.data.data is not an array");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchEventData();
  }, []);

  useEffect(() => {
    if (selectedDate && events) {
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
    }
  }, [selectedDate, events]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings`);
        setBookingData(response.data.Bookings);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchBookingData();
  }, []);

  useEffect(() => {
    function fetchUserData() {
      if (accessToken) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${VATSIM_URL}/api/user?client_id=${VATSIM_CLIENT_ID}`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        axios(config)
          .then((response) => {
            setUserData(response.data.data);
          })
          .catch((error) => {
            console.log(error);
            logout();
          });
      } else {
        console.log("Access token not available.");
      }
    }

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    if (userData) {
      console.log(userData);
      if (userData.oauth.token_valid === "false") {
        logout();
      }

      const fetchData = async () => {
        try {
          const response = await axios.post(`${API_URL}/auth/verifyLogin`, userData);

          console.log(response.data);
          if (!response.data.allowed && !response.data.loading) {
            logout(response.data.message);
          } else {
            setLoginValid(true);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    const getStoredToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        console.log("redirecting....");
        navigate("/login");
      }
    };

    getStoredToken();
  }, []);

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setSelectedDate(formattedToday);
  }, []);

  function logout(err) {
    const errorMessage = err && typeof err === "string" ? err : "You have been logged out";
    localStorage.removeItem("accessToken");
    setAccessToken("");
    navigate("/login", { state: { errorMessage } });
  }

  function dateTimeFormat(date) {
    let output = date.toISOString();
    output = output.split("T");
    return output[0];
  }

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
    <>
      {loginValid ? (
        <div className="pt-[30px]">
          <Nav />
          <div className="grid grid grid-cols-3">
            <div className="font-bold pl-7 flex gap-2 items-center">
              Beültetés ATS
              <div className="flex gap-1 items-center">
                <i className="fa-regular fa-calendar"></i>
                <DatePicker calendarStartDay={1} selected={selectedDate} onChange={(date) => setSelectedDate(dateTimeFormat(date))} highlightDates={eventDates} />
              </div>
              <i onClick={handlePrevDay} className="fa-solid fa-circle-left cursor-pointer"></i>
              <i onClick={handleNextDay} className="fa-solid fa-circle-right cursor-pointer"></i>
            </div>

            <div className="flex justify-end px-3 col-span-2">
              <p>
                {DAYS[new Date(selectedDate).getDay()]} - {currentEvent}
              </p>
            </div>
          </div>

          <BookingTable bookings={bookingData} selectedDate={selectedDate} currUser={userData} />
        </div>
      ) : (
        <Loading message="Verifying login..." />
      )}
    </>
  );
}
