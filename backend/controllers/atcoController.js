const con = require("../config/mysql");
const util = require("util");
const query = util.promisify(con.query).bind(con);

const getAllATCOs = async () => {
  try {
    const result = await query(`SELECT * from ATCOs`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
};

const getATCOByInitial = async (initial) => {
  try {
    const result = await query(`SELECT * from ATCOs WHERE initial = '${initial}'`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
}
const getATCOByCID = async (CID) => {
  try {
    const result = await query(`SELECT * from ATCOs WHERE CID = '${CID}'`);
    return { ATCOs: result, count: result.length };
  } catch (error) {
    return {error: error};
  }
}

const createATCO = async(initial, cid, name, isTrainee = 0, isInstructor = 0, isAdmin = 0) => {
  if (!initial || !cid || !name) {
    return {message: "Missing fields."}
  }

  try {
    const result = await query(`INSERT INTO ATCOs (initial, cid, name, trainee, isInstructor, isAdmin) VALUES ('${initial}', '${cid}', '${name}', ${isTrainee}, ${isInstructor}, ${isAdmin})`);
    return {result: result}
  } catch (error) {
    return {error: error};
  }
};


const updateATCO = async (cid, updates) => {
  try {
    let updateQuery = 'UPDATE ATCOs SET ';

    const updateFields = [];
    Object.keys(updates).forEach((key) => {
      updateFields.push(`${key} = '${updates[key]}'`);
    });
    updateQuery += updateFields.join(', ');

    updateQuery += ` WHERE cid = '${cid}'`;

    const result = await query(updateQuery);
    return { result: result };
  } catch (error) {
    return { error: error };
  }
};

const deleteATCO = async (cid) => {
  try {
    const result = await query(`DELETE FROM ATCOs WHERE cid = '${cid}'`);

    return { result: result };
  } catch (error) {
    return { error: error };
  }
};




module.exports = {
  getAllATCOs,
  getATCOByInitial,
  getATCOByCID,
  createATCO,
  updateATCO,
  deleteATCO
}
