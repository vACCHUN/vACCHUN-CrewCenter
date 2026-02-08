const pool = require("../config/mysql");

const getAllATCOs = async () => {
  try {
    const [rows] = await pool.query(`SELECT * from ATCOs`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getATCOByInitial = async (initial) => {
  try {
    const [rows] = await pool.query(`SELECT * from ATCOs WHERE initial = '${initial}'`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getATCOByCID = async (CID) => {
  try {
    const [rows] = await pool.query(`SELECT * from ATCOs WHERE CID = '${CID}'`);
    return { ATCOs: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const createATCO = async (initial, cid, name = null, isTrainee = 0, isInstructor = 0, isAdmin = 0, access_token = null) => {
  if (!initial || !cid) {
    return { message: "Missing fields." };
  }

  try {
    console.log(`Creating ATCO - Data:\n${initial} | ${cid} | ${name} | ${isTrainee} | ${isInstructor} | ${isAdmin} | \nTOKEN: ${access_token}`);
    const [rows] = await pool.query(
      `INSERT INTO ATCOs (initial, cid, name, trainee, isInstructor, isAdmin, access_token) VALUES ('${initial}', '${cid}', ${name ? "'" + name + "'" : 'NULL'}, ${isTrainee}, ${isInstructor}, ${isAdmin}, ${access_token ? "'" + access_token + "'" : 'NULL'})`
    );
    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const updateATCO = async (cid, updates) => {
  console.log(updates);
  try {
    let updateQuery = "UPDATE ATCOs SET ";

    const updateFields = [];
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== null) updateFields.push(`${key} = '${updates[key]}'`);
    });
    updateQuery += updateFields.join(", ");

    updateQuery += ` WHERE cid = '${cid}'`;

    const [rows] = await pool.query(updateQuery);
    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const deleteATCO = async (cid) => {
  try {
    const [rows] = await pool.query(`DELETE FROM ATCOs WHERE cid = '${cid}'`);

    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const updateAccessToken = async (cid, accessToken) => {
  try {
    const query = `UPDATE ATCOs SET access_token = ? WHERE CID = ?`;

    const values = [accessToken, cid];
    const [rows] = await pool.query(query, values);
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
  deleteATCO,
  updateAccessToken,
};
