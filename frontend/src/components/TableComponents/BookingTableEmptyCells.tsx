import { Sector } from "../../types/sectors";
import { throwError } from "../../utils/throwError";

type BookingTableEmptyCellsParams = {
  ROWS_N: number;
  cols: string[];
  activeSectors: Sector[];
};

function BookingTableEmptyCells({
  ROWS_N,
  cols,
  activeSectors,
}: BookingTableEmptyCellsParams) {
  return Array.from({ length: ROWS_N }).map((_, rowIndex) => {
    return Array.from({ length: cols.length + 1 }).map((_, colIndex) => {
      const currCol = colIndex ? cols[colIndex - 1] : false;
      let currSector: string | boolean = false;
      let currSubSector: string | boolean = false;
      let currSectorData: Sector | boolean = false;
      let classToAdd = "";
      if (currCol) {
        let elements = currCol.split("/");
        if (elements.length == 3) {
          currSector = elements[0].concat("/", elements[1]);
          currSubSector = elements[2];
        } else if (elements.length == 2) {
          currSector = elements[0];
          currSubSector = elements[1];
        }

        currSectorData = activeSectors.find((s) => s.id == currSector) ?? false;

        if (!currSectorData) throwError("Sector data not found", "Unknown");

        if (
          typeof currSubSector === "string" &&
          typeof currSectorData !== "boolean"
        ) {
          const outer =
            currSectorData.childElements.indexOf(currSubSector) ===
            currSectorData.childElements.length - 1;

          if (currSectorData.childElements.length === 1 && outer) {
            classToAdd = "doubleborder-2";
          } else if (currSectorData.childElements.length > 1 && outer) {
            classToAdd = "doubleborder-grid";
          }
        }
      }

      return rowIndex === 0 || colIndex === 0 ? null : (
        <div
          key={`empty-${rowIndex}-${colIndex}`}
          className={`empty-cell ${classToAdd}`}
          style={{
            gridRowStart: rowIndex + 1,
            gridRowEnd: rowIndex + 2,
            gridColumnStart: colIndex + 1,
            gridColumnEnd: colIndex + 2,
          }}
        />
      );
    });
  });
}

export default BookingTableEmptyCells;
