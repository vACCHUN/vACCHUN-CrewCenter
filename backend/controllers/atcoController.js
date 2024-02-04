const con = require("../config/mysql");
const util = require("util");
const query = util.promisify(con.query).bind(con);

const getAllATCOs = async () => {
  try {
    const result = await query(`SELECT * from ATCOs`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return error;
  }
};

const getATCOByInitial = async (initial) => {
  try {
    const result = await query(`SELECT * from ATCOs WHERE initial = '${initial}'`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return error;
  }
}
const getATCOByCID = async (CID) => {
  try {
    const result = await query(`SELECT * from ATCOs WHERE CID = '${CID}'`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return error;
  }
}




module.exports = {
  getAllATCOs,
  getATCOByInitial,
  getATCOByCID
}
