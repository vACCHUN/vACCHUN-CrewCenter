import { useEffect, useState } from "react";
import axios from "axios";
import { getSectorsByMinRating } from "../utils/sectorUtils";
import config from "../config";
import { throwError } from "../utils/throwError";
import { VatsimUser } from "../types/users";
import { Sector } from "../types/sectors";
const API_URL = config.API_URL;

function useSectorsByMinRating(userData: VatsimUser, isAdmin: boolean) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  useEffect(() => {
    const fetchSectors = async () => {
      if (!userData) return;
      setSectorsLoading(true);

      try {
        const response = await axios.get(`${API_URL}/atcos/cid/${userData.cid}`);
        const isTrainee = response.data.ATCOs[0]?.trainee === 1;
        let minRating = isTrainee ? userData.vatsim.rating.id + 1 : userData.vatsim.rating.id;
        if (isAdmin === true) minRating = 10;

        const rawSectors = await getSectorsByMinRating(minRating);
        const uniqueSectors: Sector[] = Array.from(new Set(rawSectors));
        setSectors(uniqueSectors);
      } catch (error) {
        throwError("Error fetching sectors (by rating): ", error);
      } finally {
        setSectorsLoading(false);
      }
    };

    fetchSectors();
  }, [userData, isAdmin]);

  return { sectors, sectorsLoading };
}

export default useSectorsByMinRating;
