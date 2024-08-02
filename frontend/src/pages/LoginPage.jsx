import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from '../config';
const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;
const VATSIM_REDIRECT_URL = config.VATSIM_REDIRECT;


function App() {
  const navigate = useNavigate();

  const [authorizationCode, setAuthorizationCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const location = useLocation();

  const errorMessage = location.state && location.state.errorMessage;

  useEffect(() => {
    const getStoredToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
        setAuthorizationCode("authorized");
      }
    };

    getStoredToken();
  }, []);

  useEffect(() => {
    console.log(accessToken);
    if (accessToken) {
      fetchUserData();
      console.log("fetching");
    }
  }, []);

  function getToken(code) {
    axios
      .post(`${API_URL}/auth/getToken`, { code })
      .then((response) => {
        const token = response.data.access_token;
        setAccessToken(token);
        setAuthorizationCode("authorized");
        localStorage.setItem("accessToken", token);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const getCodeFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        setAuthorizationCode("authorized");
        getToken(code);
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    getCodeFromUrl();
  }, []);

  function login() {
    window.location.href = `${VATSIM_URL}/oauth/authorize?client_id=${VATSIM_CLIENT_ID}&response_type=code&scope=full_name+email+vatsim_details&redirect_uri=${VATSIM_REDIRECT_URL}`;
  }

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
          setUserData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Access token not available.");
    }
  }

  useEffect(() => {
    if (errorMessage) {
      {errorMessage == "You have been logged out" ? toast.info(errorMessage, {
        position: "bottom-left",
        autoClose: 5000,
        theme: "light",
      }) : toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 5000,
        theme: "light",
      })}
    }
  }, [errorMessage]);

  return (
    <>
      {authorizationCode === "authorized" ? (
        <div>
          <Loading message="Authenticating..."></Loading>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-screen h-screen justify-center items-center">
            <h1 className="mb-4 text-4xl text-blue-900">vACCHUN Crew Center</h1>
            <button className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"  onClick={login}>Login</button>
            <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
