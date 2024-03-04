import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Loading from './components/Loading';

export default function App() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(false)
  useEffect(() => {
    const getStoredToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        console.log("redirecting....")
        navigate("/login")
      }
    };

    getStoredToken();
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    setAccessToken("");
    navigate("/login");
  }

  return (
    <div>
      <Loading></Loading>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
