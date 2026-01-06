export type Sector = {
  childElements: string[];
  id: string;
  minRating: number;
  priority: number;
};

export type RequiredSector = {
  sector: string;
  subSector: string;
};

export type SectorisationCode = {
  id: number;
  name: string;
  sectorType: string;
  requiredSectors: RequiredSector[];
};
