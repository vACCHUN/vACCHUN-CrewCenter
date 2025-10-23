import axios from "axios";
import config from "../config";
import { Sector } from "../types/sectors";

const API_URL = config.API_URL;

export async function getSectorsByMinRating(minRating: number, accessToken?: string): Promise<Sector[]> {
  const response = await axios.get(`${API_URL}/sectors/minRating/${minRating}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const sectorList: Sector[] = response.data.Sectors;
  const uniqueSectors = Array.from(new Set(sectorList));
  return uniqueSectors;
}

export async function getAllSectors(accessToken?: string): Promise<Sector[]> {
  const response = await axios.get(`${API_URL}/sectors`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.Sectors;
}
