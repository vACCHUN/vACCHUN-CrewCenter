import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { VatsimUser } from "../types/users";

export default function useAdminStatus(userData: VatsimUser | null) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userData) {
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        // use axios instead of custom api instance to bypass interception of 403 error code
        const response = await axios.get(`/api/atcos/cid/${userData.cid}`, {
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

        if (axios.isAxiosError(error) && error.response && error.response.status == 403) {
          return;
        }

        throwError("Error checking admin status: ", error);
      }
    };

    checkAdmin();
  }, [userData]);

  return isAdmin;
}
