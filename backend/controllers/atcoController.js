const pool = require("../config/mysql");
const util = require("util");

const getAllATCOs = async () => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from ATCOs`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
};

const getATCOByInitial = async (initial) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from ATCOs WHERE initial = '${initial}'`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
}
const getATCOByCID = async (CID) => {
  try {
    const [rows, fields] = await pool.query(`SELECT * from ATCOs WHERE CID = '${CID}'`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return {error: error};
  }
}

const createATCO = async(initial, cid, name, isTrainee = 0, isInstructor = 0, isAdmin = 0) => {
  if (!initial || !cid || !name) {
    return {message: "Missing fields."}
  }

  try {
    const [rows, fields] = await pool.query(`INSERT INTO ATCOs (initial, cid, name, trainee, isInstructor, isAdmin) VALUES ('${initial}', '${cid}', '${name}', ${isTrainee}, ${isInstructor}, ${isAdmin})`);
    return {result: rows}
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

    const [rows, fields] = await pool.query(updateQuery);
    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const deleteATCO = async (cid) => {
  try {
    const [rows, fields] = await pool.query(`DELETE FROM ATCOs WHERE cid = '${cid}'`);

    return { result: rows };
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
