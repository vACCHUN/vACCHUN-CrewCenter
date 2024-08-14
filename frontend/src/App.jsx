import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import axios from "axios";
import BookingTable from "./components/BookingTable";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import config from "./config";
const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;

export default function App() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState(false);

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

          <BookingTable currUser={userData} />
        </div>
      ) : (
        <Loading message="Verifying login..." />
      )}
    </>
  );
}
