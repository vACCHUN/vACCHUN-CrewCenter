const con = require("../config/mysql");
const util = require("util");
const query = util.promisify(con.query).bind(con);

const getAllSectors = async () => {
  try {
    const result = await query(`SELECT * from sectors ORDER BY priority`);
    return { Sectors: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
};

const getSectorById = async (id) => {
  try {
    const result = await query(`SELECT * from sectors WHERE id = '${id}' ORDER BY priority`);
    return { Sectors: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
};

const getSectorByMinRating = async (minRating) => {
  try {
    const result = await query(`SELECT * from sectors WHERE minRating <= '${minRating}' ORDER BY priority`);
    return { Sectors: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
};




module.exports = {
  getAllSectors,
  getSectorById,
  getSectorByMinRating
};
