const pool = require("../config/mysql");
const { isTimeInBooking, sectorToString } = require("../utils/sectorisation");

const getAllSectors = async () => {
  try {
    const [rows] = await pool.query(`SELECT * from sectors ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorById = async (id) => {
  try {
    const [rows] = await pool.query(`SELECT * from sectors WHERE id = '${id}' ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorByMinRating = async (minRating) => {
  try {
    const [rows] = await pool.query(`SELECT * from sectors WHERE minRating <= ${parseInt(minRating)} ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getSectorisationCodes = async () => {
  try {
    const [rows] = await pool.query(`SELECT * from sectorisationCodes ORDER BY name DESC`);
    return { Sectorisations: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};
const checkApplicableSectorisation = async (date) => {
  const getBookingsWithDate = async (date) => {
    try {
      const [rows] = await pool.query(`
      SELECT * 
      FROM controllerBookings 
      WHERE DATE(startTime) = '${date}' 
        AND deleted = 0 
      ORDER BY startTime
    `);
      return { Bookings: rows, count: rows.length };
    } catch (error) {
      return { error: error };
    }
  };
  try {
    const sectorisationCodes = (await getSectorisationCodes()).Sectorisations;

    let sectorisations = [];
    const bookingsOfTheDay = await getBookingsWithDate(date);

    let currSectorisations = {};
    let sectorTypes = {};

    // Initialize currSectorisations with all known sector types
    sectorisationCodes.forEach((sectorisation) => {
      if (sectorisation.sectorType && !currSectorisations[sectorisation.sectorType]) {
        currSectorisations[sectorisation.sectorType] = {
          name: false,
          startTime: false,
        };
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
              name: sectorisation.name, // Changed from id to name
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
            expectedSectorisation = applicableForType[0].name; // Changed from id to name
          }

          const currentForType = currSectorisations[sectorType];

          if (!expectedSectorisation) {
            if (currentForType.name) {
              // Changed from id to name
              // End the current sectorisation period for this type
              sectorisations.push({
                sectorisationName: currentForType.name, // Changed from id to name
                sectorType: sectorType,
                start: currentForType.startTime,
                end: time,
              });
              currSectorisations[sectorType] = {
                name: false,
                startTime: false,
              }; // Changed from id to name
            }
            continue;
          }

          if (currentForType.name) {
            // Changed from id to name
            if (currentForType.name !== expectedSectorisation) {
              // Changed from id to name
              // End the current sectorisation period for this type
              sectorisations.push({
                sectorisationName: currentForType.name, // Changed from id to name
                sectorType: sectorType,
                start: currentForType.startTime,
                end: time,
              });
              // Start new sectorisation period for this type
              currSectorisations[sectorType] = {
                name: expectedSectorisation, // Changed from id to name
                startTime: time,
              };
            }
          } else {
            // No current sectorisation for this type, start a new one
            currSectorisations[sectorType] = {
              name: expectedSectorisation, // Changed from id to name
              startTime: time,
            };
          }
        }
      }
    }

    // Add any remaining active sectorisations at the end of the day
    for (const sectorType of Object.keys(sectorTypes)) {
      const currentForType = currSectorisations[sectorType];
      if (currentForType.name) {
        // Changed from id to name
        sectorisations.push({
          sectorisationName: currentForType.name, // Changed from id to name
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
module.exports = {
  getAllSectors,
  getSectorById,
  getSectorByMinRating,
  checkApplicableSectorisation,
  getSectorisationCodes,
};
