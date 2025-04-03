import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { throwError } from "../utils/throwError";
import { VatsimUser } from "../types/users";
import { Sector } from "../types/sectors";

const API_URL = config.API_URL;

function useSectors(userData: VatsimUser, isAdmin: boolean) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);

  useEffect(() => {
    const getIsTrainee = async (cid: string) => {
      try {
        const response = await axios.get(`${API_URL}/atcos/cid/${cid}`);
        const atco = response.data.ATCOs[0];
        return atco?.trainee === 1;
      } catch (error) {
        throwError("Error fetching trainee status: ", error);
      }
    };

    const fetchSectors = async () => {
      setSectors([]);
      setSectorsLoading(true);

      try {
        const isTrainee = await getIsTrainee(userData.cid);
        let minRating = isTrainee ? userData.vatsim.rating.id + 1 : userData.vatsim.rating.id;
        if (isAdmin === true) minRating = 10;

        const response = await axios.get(`${API_URL}/sectors/minRating/${minRating}`);
        const sectorList: Sector[] = response.data.Sectors;
        const uniqueSectors = new Set(sectorList);
        setSectors(Array.from(uniqueSectors));
      } catch (error) {
        throwError("Error fetching sectors: ", error);
      } finally {
        setSectorsLoading(false);
      }
    };

    fetchSectors();
  }, [userData, isAdmin]);

  return { sectors, sectorsLoading };
}

export default useSectors;
