import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

export async function getSectorsByMinRating(minRating) {
  try {
    const response = await axios.get(`${API_URL}/sectors/minRating/${minRating}`);
    const sectorList = response.data.Sectors;
    const uniqueSectors = Array.from(new Set(sectorList));
    return uniqueSectors;
  } catch (error) {
    console.error("Failed to fetch sectors:", error);
    throw error;
  }
}

export async function getAllSectors() {
  try {
    const response = await axios.get(`${API_URL}/sectors`);
    return response.data.Sectors;
  } catch (error) {
    console.error("Failed to fetch all sectors:", error);
    throw error;
  }
}