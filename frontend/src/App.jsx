import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";
import Nav from "./components/Nav";

export default function App() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [bookingData, setBookingData] = useState("");
  const [loginValid, setLoginValid] = useState("");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/bookings");

        setBookingData(response.data.Bookings);
      } catch (error) {
        console.error("Error:", error);
      } finally {
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
          url: "https://auth-dev.vatsim.net/api/user?client_id=745",
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
          });
      } else {
        console.log("Access token not available.");
      }
    }

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    if (userData) {
      if (userData.oauth.token_valid == "false") {
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
        } finally {
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

  function logout(err) {
    const errorMessage = err && typeof err === "string" ? err : "You have been logged out";
    localStorage.removeItem("accessToken");
    setAccessToken("");
    navigate("/login", { state: { errorMessage } });
  }

  return (
    <>
      {loginValid ? (
        <div className="pt-[30px]">
          <Nav />
          <div className="border-b-2 border-black font-bold pl-7">Beültetés ATS 2023. 11. 23.</div>
          <table className="text-center">
            <thead className="sticky">
              <tr className="headerrow">
                <td rowSpan={2}>Helyi idő</td>
                <td>BTWR</td>
                <td>SV</td>
                <td>ADC</td>
                <td>GRC</td>
                <td>TPC</td>
                <td>CDC</td>
              </tr>
              <tr className="headerrow align-top">
                <td>BTWR</td>
                <td>SV</td>
                <td>ADC</td>
                <td>GRC</td>
                <td>TPC</td>
                <td>CDC</td>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = [];
                for (let hour = 0; hour < 24; hour++) {
                  rows.push(
                    <tr className="timerow" key={hour}>
                      <td className="">{`${hour}:00 - ${hour + 1}:00`}</td>
                      {hour == 2 ? <td>CS</td> : <td></td>}
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  );
                }
                return rows;
              })()}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading message="Verifying login..." />
      )}
    </>
  );
}
