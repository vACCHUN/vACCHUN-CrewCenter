import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import config from "../config";
import useToast from "../hooks/useToast";
import CustomToastContainer from "../components/CustomToastContainer";
import { throwError } from "../utils/throwError";
import { User } from "../types/users";

const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;
const VATSIM_REDIRECT_URL = config.VATSIM_REDIRECT;

function App() {
  const navigate = useNavigate();

  const [authorizationCode, setAuthorizationCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const location = useLocation();
  const { sendError, sendInfo } = useToast();

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
    if (accessToken) {
      fetchUserData();
    }
  }, []);

  function getToken(code: string) {
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
        throwError("Error getting token:", error);
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
          throwError("Error fetching user data: ", error);
        });
    } else {
      console.log("Access token not available.");
    }
  }

  useEffect(() => {
    if (errorMessage) {
      sendInfo(errorMessage);
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
            <button className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={login}>
              Login
            </button>
            <CustomToastContainer />
          </div>
        </>
      )}
    </>
  );
}

export default App;
