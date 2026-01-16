import axios from "axios";
import { triggerLogout } from "./emitters/logoutEmitter";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      triggerLogout("Session expired");
    }

    return Promise.reject(err);
  },
);

export default api;
