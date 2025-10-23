import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { Toast } from "../types/toasts";
import { User } from "../types/users";
import useAuth from "./useAuth";

const API_URL = config.API_URL;

function useAtcos(sendError: Toast, sendInfo: Toast) {
  const [atcos, setATCOs] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const fetchATCOs = async () => {
    try {
      const response = await axios.get(`${API_URL}/atcos`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });
      const data = response.data;
      setATCOs(data.ATCOs);
      setTotalCount(data.count);
      setLoading(false);
    } catch (error) {
      sendError("Error fetching ATCOs.");
      throwError("Error fetching ATCOs: ", error);
    }
  };

  useEffect(() => {
    fetchATCOs();
  }, []);

  const deleteAtco = async (cid: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/atcos/delete/${cid}`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });
      setATCOs((prev) => prev.filter((atco) => atco.CID != cid));
      setTotalCount((count) => count - 1);
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting ATCO.");
      setLoading(false);
      throwError("Error deleting ATCO: ", error);
    }
  };

  return { atcos, totalCount, loading, deleteAtco, refreshATCOs: fetchATCOs };
}

export default useAtcos;
