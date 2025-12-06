import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { VatsimUser } from "../types/users";
import api from "../axios";

const API_URL = config.API_URL;

export default function useAdminStatus(userData: VatsimUser | null, isLoginValid = true) {
  const [isAdmin, setIsAdmin] = useState(false);

  console.log(userData?.access_token);

  useEffect(() => {
    if (!userData) {
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      if (!isLoginValid) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await api.get(`/atcos/cid/${userData.cid}`, {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        });

        const atcos = response.data?.ATCOs;

        if (Array.isArray(atcos) && atcos.length > 0) {
          setIsAdmin(atcos[0].isAdmin === 1);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
        throwError("Error checking admin status: ", error);
      }
    };

    checkAdmin();
  }, [userData]);

  return isAdmin;
}
