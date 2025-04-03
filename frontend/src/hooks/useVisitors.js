import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";

const API_URL = config.API_URL;

function useVisitors(sendError, sendInfo) {
  const [visitors, setVisitors] = useState([]);
  const [visitorsCount, setVisitorsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${API_URL}/visitors`);
      const data = response.data;
      setVisitors(data.visitors);
      setVisitorsCount(data.count);
      setLoading(false);
    } catch (error) {
      sendError("Error fetching visitors");
      throwError("Error fetching visitors: ", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const deleteVisitor = async (cid) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/visitors/delete/${cid}`);
      setVisitors((prev) => prev.filter((v) => v.cid !== cid));
      setVisitorsCount((count) => count - 1);
      setLoading(false);
      sendInfo(`Deleted ${cid}`);
    } catch (error) {
      sendError("Error while deleting visitor.");
      setLoading(false);
      throwError("Error deleting visitor: ", error);
    }
  };

  return {
    visitors,
    visitorsCount,
    loading,
    deleteVisitor,
    refreshVisitors: fetchVisitors,
  };
}

export default useVisitors;
