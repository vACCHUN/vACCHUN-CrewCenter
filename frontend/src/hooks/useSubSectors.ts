import { useEffect, useState } from "react";
import { Sector } from "../types/sectors";

function useSubSectors(selectedSectorId: string, allSectors: Sector[]) {
  const [subSectors, setSubSectors] = useState<string[]>([]);

  useEffect(() => {
    const selectedSector = allSectors.find((sector: Sector) => sector.id == selectedSectorId);
    if (selectedSector) {
      setSubSectors(selectedSector.childElements || []);
    } else {
      setSubSectors([]);
    }
  }, [selectedSectorId, allSectors]);

  return subSectors;
}

export default useSubSectors;
