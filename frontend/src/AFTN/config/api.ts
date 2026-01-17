import axios from "axios";

const cdmApi = axios.create({
  baseURL: "https://cdm-server-production.up.railway.app",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

export default cdmApi;
