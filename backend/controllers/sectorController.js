const pool = require("../config/mysql");
const util = require("util");
const atcoController = require("./atcoController");

const getAllSectors = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
};

const getSectorById = async (id) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors WHERE id = '${id}' ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
};

const getSectorByMinRating = async (minRating) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from sectors WHERE minRating <= ${parseInt(minRating)} ORDER BY priority`);
    return { Sectors: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
};




module.exports = {
  getAllSectors,
  getSectorById,
  getSectorByMinRating
};
