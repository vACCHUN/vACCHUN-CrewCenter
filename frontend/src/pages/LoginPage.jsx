import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Loading from "../components/Loading";

function App() {
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/auth/verifyLogin", userData.data);
        if (!response.data.allowed && !response.data.loading) {
          logout(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

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
    fetchUserData();
    console.log(accessToken);
  }, [accessToken]);

  function getToken(code) {
    axios
      .post("http://localhost:3000/auth/getToken", { code })
      .then((response) => {
        const token = response.data.access_token;
        setAccessToken(token);
        setAuthorizationCode("authorized");
        localStorage.setItem("accessToken", token);
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

  function logout(err = false) {
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setAuthorizationCode("");
    setUserData("");
    if (err) {
      setLoginError(err);
    }
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

  return (
    <>
      {authorizationCode === "authorized" ? (
        <div>
          <p>Authorization Code: {authorizationCode}</p>
          <>
            {userData ? userData.data.cid : "no user data"}
            <button onClick={() => logout()}>Log out</button>

          </>
        </div>
      ) : (
        <>
          <p>{loginError ? loginError : ""}</p>
          <button onClick={login}>Login</button>
        </>
      )}
    </>
  );
}

export default App;
