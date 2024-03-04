import { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState("");
  const [loginValid, setLoginValid] = useState("");

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
          const adminResponse = await axios.get(`http://localhost:3000/atcos/cid/${userData.cid}`);
          if (!adminResponse.data.ATCOs[0].isAdmin) {
            logout("Unsufficent permissions");
          } 
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

  return <div>admin</div>;
}

export default AdminPage;
