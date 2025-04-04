import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

export default function useAdminStatus(userData) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userData) return;

    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API_URL}/atcos/cid/${userData.cid}`);
        const atcos = response.data?.ATCOs;

        if (Array.isArray(atcos) && atcos.length > 0) {
          setIsAdmin(atcos[0].isAdmin === 1);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [userData]);

  return isAdmin;
}
