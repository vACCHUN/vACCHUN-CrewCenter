import { useState } from "react";
import "./App.css";
import axios, { isCancel, AxiosError } from "axios";

function App() {
  function login() {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://auth.vatsim.net/oauth/authorize",
      headers: {},
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <button onClick={login}>Login</button>
    </>
  );
}

export default App;
