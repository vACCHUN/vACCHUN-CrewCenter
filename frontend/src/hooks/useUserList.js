import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import config from "../config";
const API_URL = config.API_URL;

function useUserList() {
  const [userlist, setUserlist] = useState([]);
  const [userlistLoading, setUserlistLoading] = useState(false);
  const { userData, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserList = async () => {
      setUserlistLoading(true);
      try {
        const response = await axios.get(`${API_URL}/atcos/`);
        setUserlist(response.data.ATCOs || []);
      } catch (error) {
        throw Error("Error fetching user list", error);
      } finally {
        setUserlistLoading(false);
      }
    };

    if (isAdmin) {
      fetchUserList();
    }
  }, [isAdmin]);

  return { userlist, userlistLoading };
}

export default useUserList;
