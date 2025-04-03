import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

function useAtcos(sendError, sendInfo) {
  const [atcos, setATCOs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchATCOs = async () => {
    try {
      const response = await axios.get(`${API_URL}/atcos`);
      const data = response.data;
      setATCOs(data.ATCOs);
      setTotalCount(data.count);
      setLoading(false);
    } catch (error) {
      sendError("Error fetching ATCOs.");
      throw Error("Error fetching ATCOs", error);
    }
  };

  useEffect(() => {
    fetchATCOs();
  }, []);

  const deleteAtco = async (cid) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/atcos/delete/${cid}`);
      setATCOs((prev) => prev.filter((a) => a.CID !== cid));
      setTotalCount((count) => count - 1);
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting ATCO.");
      setLoading(false);
      throw Error("Error deleting ATCO", error);
    }
  };

  return { atcos, totalCount, loading, deleteAtco, refreshATCOs: fetchATCOs };
}

export default useAtcos;
