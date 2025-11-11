import axios from "axios";
import config from "../config";
import { Sector } from "../types/sectors";
import api from "../axios";

const API_URL = config.API_URL;

export async function getSectorsByMinRating(minRating: number, accessToken?: string): Promise<Sector[]> {
  const response = await api.get(`/sectors/minRating/${minRating}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const sectorList: Sector[] = response.data.Sectors;
  const uniqueSectors = Array.from(new Set(sectorList));
  return uniqueSectors;
}

export async function getAllSectors(accessToken?: string): Promise<Sector[]> {
  const response = await api.get(`/sectors`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.Sectors;
}
