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

        const hasADC = onlineSectors.includes(adc);
        const hasGRC = onlineSectors.includes(grc);
        const hasCDC = onlineSectors.includes(cdc);

        let expectedSectorisation = false;

        if (hasADC && hasGRC && hasCDC) {
          expectedSectorisation = "GRC-TPC";
        } else if (hasADC && hasGRC && !hasCDC) {
          expectedSectorisation = "GRC-TPC-CDC";
        }

        if (!expectedSectorisation) {
          if (currSectorisation) {
            sectorisations.push({
              sectorisationName: currSectorisation,
              start: currSectorStartTime,
              end: time,
            });
            currSectorisation = false;
            currSectorStartTime = false;
          }
          continue;
        }

        if (currSectorisation) {
          if (currSectorisation !== expectedSectorisation) {
            // End the current sectorisation period
            sectorisations.push({
              sectorisationName: currSectorisation,
              start: currSectorStartTime,
              end: time,
            });
            // Start new sectorisation period
            currSectorisation = expectedSectorisation;
            currSectorStartTime = time;
          }
        } else {
          // No current sectorisation, start a new one
          currSectorisation = expectedSectorisation;
          currSectorStartTime = time;
        }
      }
    }

    if (currSectorisation) {
      sectorisations.push({
        sectorisationName: currSectorisation,
        start: currSectorStartTime,
        end: { hours: 23, minutes: 55 },
      });
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
