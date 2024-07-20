import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";
import Nav from "./components/Nav";
import BookingTable from "./components/BookingTable";

export default function App() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [bookingData, setBookingData] = useState([]);
  const [loginValid, setLoginValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/bookings");
        setBookingData(response.data.Bookings);
      } catch (error) {
        console.error("Error:", error);
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
          url: "https://auth-dev.vatsim.net/api/user?client_id=1389",
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
      if (userData.oauth.token_valid === "false") {
        logout();
      }

      const fetchData = async () => {
        try {
          const response = await axios.post("http://localhost:3000/auth/verifyLogin", userData);

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
    const formattedToday = today.toISOString().split('T')[0];
    setSelectedDate(formattedToday);
  }, []);

  function logout(err) {
    const errorMessage = err && typeof err === "string" ? err : "You have been logged out";
    localStorage.removeItem("accessToken");
    setAccessToken("");
    navigate("/login", { state: { errorMessage } });
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <>
      {loginValid ? (
        <div className="pt-[30px]">
          <Nav />
          <div className="font-bold pl-7">
            Beültetés ATS <input type="date" value={selectedDate} onChange={handleDateChange} />
          </div>
          <BookingTable bookings={bookingData} selectedDate={selectedDate} />
        </div>
      ) : (
        <Loading message="Verifying login..." />
      )}
    </>
  );
}
