const pool = require("../config/mysql");

async function getMatchingCallsign(sector, subSector) {
  const [rows] = await pool.query(
    "SELECT callsign FROM callsigns WHERE sector = ? AND subSector = ?",
    [sector, subSector],
  );

  const callsign = rows.length > 0 ? rows[0].callsign : null;
  return callsign;
}

module.exports = { getMatchingCallsign };
