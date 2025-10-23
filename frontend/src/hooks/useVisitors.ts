import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { Toast } from "../types/toasts";
import { Visitor } from "../types/atco";
import useAuth from "./useAuth";

const API_URL = config.API_URL;

function useVisitors(sendError: Toast, sendInfo: Toast) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorsCount, setVisitorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${API_URL}/visitors`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });
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

  const deleteVisitor = async (cid: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/visitors/delete/${cid}`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
        },
      });

      setVisitors((prev) => {
        const updated = prev.filter((v) => v.cid !== cid);

        if (updated.length < prev.length) {
          setVisitorsCount((count) => count - 1);
        }

        return updated;
      });

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
