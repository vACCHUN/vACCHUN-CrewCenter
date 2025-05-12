import axios from "axios";
import config from "../config";
import { Sector } from "../types/sectors";

const API_URL = config.API_URL;

export async function getSectorsByMinRating(minRating: number): Promise<Sector[]> {
  const response = await axios.get(`${API_URL}/sectors/minRating/${minRating}`);
  const sectorList: Sector[] = response.data.Sectors;
  const uniqueSectors = Array.from(new Set(sectorList));
  return uniqueSectors;
}

export async function getAllSectors(): Promise<Sector[]> {
  const response = await axios.get(`${API_URL}/sectors`);
  return response.data.Sectors;
}
