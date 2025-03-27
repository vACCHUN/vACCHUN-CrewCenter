import { useEffect, useState } from "react";

function useSubSectors(selectedSectorId, allSectors) {
  const [subSectors, setSubSectors] = useState([]);

  useEffect(() => {
    const selectedSector = allSectors.find((sector) => sector.id === selectedSectorId);
    if (selectedSector) {
      setSubSectors(selectedSector.childElements || []);
    } else {
      setSubSectors([]);
    }
  }, [selectedSectorId, allSectors]);

  return subSectors;
}

export default useSubSectors;
