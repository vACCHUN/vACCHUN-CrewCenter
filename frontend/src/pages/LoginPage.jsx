import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      .post("/api/auth/getToken", { code })
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
    window.location.href = "https://auth-dev.vatsim.net/oauth/authorize?client_id=745&response_type=code&scope=full_name+email+vatsim_details&redirect_uri=http://localhost:5173/login";
  }

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
        theme: "dark",
      }) : toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 5000,
        theme: "dark",
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
          <div className="flex flex-col items-center">
            <h1 className="mb-4 text-blue-200">vACCHUN Crew Center</h1>
            <button onClick={login}>Login</button>
            <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
