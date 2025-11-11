import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import useAuth from "./useAuth";
import api from "../axios";
const API_URL = config.API_URL;

function useUserList() {
  const [userlist, setUserlist] = useState([]);
  const [userlistLoading, setUserlistLoading] = useState(false);

  const { userData, isAdmin } = useAuth();

  useEffect(() => {
    const fetchUserList = async () => {
      setUserlistLoading(true);
      try {
        const response = await api.get(`/atcos/`, {
          headers: {
            Authorization: `Bearer ${userData?.access_token}`,
          },
        });
        setUserlist(response.data.ATCOs || []);
      } catch (error) {
        throwError("Error fetching user list: ", error);
      } finally {
        setUserlistLoading(false);
      }
    };

    fetchUserList();
  }, [isAdmin]);

  return { userlist, userlistLoading };
}

export default useUserList;
