const pool = require("../config/mysql");
const bookingController = require("./bookingController");
const { isTimeInBooking, sectorToString, sumTimes } = require("../utils/sectorisation");

const getAllSectors = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorById = async (id) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors WHERE id = '${id}' ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorByMinRating = async (minRating) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors WHERE minRating <= ${parseInt(minRating)} ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorisationCodes = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectorisationCodes ORDER BY id`);
    return { Sectorisations: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const checkApplicableSectorisation = async (date) => {
  try {
    const sectorisationCodes = (await getSectorisationCodes()).Sectorisations;

    let sectorisations = [];
    const bookingsOfTheDay = await bookingController.getBookingsWithDate(date);

    let currSectorisations = {};
    let sectorTypes = {};

    // Initialize currSectorisations with all known sector types
    sectorisationCodes.forEach((sectorisation) => {
      if (sectorisation.sectorType && !currSectorisations[sectorisation.sectorType]) {
        currSectorisations[sectorisation.sectorType] = { id: false, startTime: false };
        sectorTypes[sectorisation.sectorType] = true;
      }
    });

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const time = { hours, minutes };
        const bookingsInTimeInterval = bookingsOfTheDay?.Bookings?.filter((booking) => {
          return isTimeInBooking(time, booking);
        });

        let onlineSectors = [];
        bookingsInTimeInterval.forEach((booking) => {
          const curr = sectorToString(booking.sector, booking.subSector);
          if (!onlineSectors.includes(curr)) {
            onlineSectors.push(curr);
          }
        });

        // Group sectorisations by type first
        const sectorisationsByType = {};

        // Find ALL applicable sectorisations grouped by type
        for (const sectorisation of sectorisationCodes) {
          if (!sectorisation.sectorType) continue;

          const requiredSectors = sectorisation.requiredSectors;
          const allRequirementsMet = requiredSectors.every((requiredSector) => {
            const sectorString = sectorToString(requiredSector.sector, requiredSector.subSector);
            return onlineSectors.includes(sectorString);
          });

          if (allRequirementsMet) {
            if (!sectorisationsByType[sectorisation.sectorType]) {
              sectorisationsByType[sectorisation.sectorType] = [];
            }
            sectorisationsByType[sectorisation.sectorType].push({
              id: sectorisation.id,
              requirementCount: requiredSectors.length,
            });
          }
        }

        // For each sector type, select the strictest applicable sectorisation
        for (const sectorType of Object.keys(sectorTypes)) {
          const applicableForType = sectorisationsByType[sectorType] || [];
          let expectedSectorisation = false;

          if (applicableForType.length > 0) {
            // Sort by requirement count descending and take the first one (strictest)
            applicableForType.sort((a, b) => b.requirementCount - a.requirementCount);
            expectedSectorisation = applicableForType[0].id;
          }

          const currentForType = currSectorisations[sectorType];

          if (!expectedSectorisation) {
            if (currentForType.id) {
              // End the current sectorisation period for this type
              sectorisations.push({
                sectorisationName: currentForType.id,
                sectorType: sectorType,
                start: currentForType.startTime,
                end: time,
              });
              currSectorisations[sectorType] = { id: false, startTime: false };
            }
            continue;
          }

          if (currentForType.id) {
            if (currentForType.id !== expectedSectorisation) {
              // End the current sectorisation period for this type
              sectorisations.push({
                sectorisationName: currentForType.id,
                sectorType: sectorType,
                start: currentForType.startTime,
                end: time,
              });
              // Start new sectorisation period for this type
              currSectorisations[sectorType] = {
                id: expectedSectorisation,
                startTime: time,
              };
            }
          } else {
            // No current sectorisation for this type, start a new one
            currSectorisations[sectorType] = {
              id: expectedSectorisation,
              startTime: time,
            };
          }
        }
      }
    }

    // Add any remaining active sectorisations at the end of the day
    for (const sectorType of Object.keys(sectorTypes)) {
      const currentForType = currSectorisations[sectorType];
      if (currentForType.id) {
        sectorisations.push({
          sectorisationName: currentForType.id,
          sectorType: sectorType,
          start: currentForType.startTime,
          end: { hours: 23, minutes: 55 },
        });
      }
    }

    console.log(sectorisations);
    return sectorisations;
  } catch (error) {
    return { error: error };
  }
};

/*const checkApplicableSectorisation = async (date) => {
  try {
    let sectorisations = [];

    const bookingsOfTheDay = await bookingController.getBookingsWithDate(date);

    let currSectorisation = false;
    let currSectorStartTime = false;

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const time = { hours, minutes };
        const bookingsInTimeInterval = bookingsOfTheDay?.Bookings?.filter((booking) => {
          return isTimeInBooking(time, booking);
        });

        let onlineSectors = [];

        bookingsInTimeInterval.forEach((booking) => {
          const curr = sectorToString(booking.sector, booking.subSector);
          if (!onlineSectors.includes(curr)) {
            onlineSectors.push(curr);
          }
        });

        const adc = sectorToString("ADC", "ADC");
        const grc = sectorToString("GRC", "GRC");
        const cdc = sectorToString("CDC", "CDC");

        if (onlineSectors.includes(adc) && onlineSectors.includes(grc) && onlineSectors.includes(cdc)) {
          console.log("-1");
          console.log(hours, minutes);

          if (!currSectorisation) {
            currSectorisation = "GRC-TPC";
            currSectorStartTime = time;
          } else if (currSectorisation != "GRC-TPC") {
            currSectorEndTime = time;
            sectorisations.push({ sectorisationName: currSectorisation, start: currSectorStartTime, end: time });
            currSectorisation = false;
            currSectorStartTime = false;
          }
        }

        if (onlineSectors.includes(adc) && onlineSectors.includes(grc) && !onlineSectors.includes(cdc)) {
          console.log("NULLADIK");
          console.log(hours, minutes);
          console.log(currSectorisation);

          if (!currSectorisation) {
            console.log("ELSO");

            currSectorisation = "GRC-TPC-CDC";
            currSectorStartTime = time;
          } else if (currSectorisation != "GRC-TPC-CDC") {
            console.log("MASODIK");

            currSectorEndTime = time;
            sectorisations.push({ sectorisationName: currSectorisation, start: currSectorStartTime, end: time });
            currSectorisation = false;
          }
        }       
      }
    }

    console.log(sectorisations);

    return sectorisations;
  } catch (error) {
    return { error: error };
  }
};*/

module.exports = {
  getAllSectors,
  getSectorById,
  getSectorByMinRating,
  checkApplicableSectorisation,
};
