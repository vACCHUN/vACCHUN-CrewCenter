import axios from "axios";

const api = axios.create({
  baseURL: "https://cdm-server-production.up.railway.app",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "x-api-key": import.meta.env.VITE_CDM_APIKEY,
  },
});

export default api;
