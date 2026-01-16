const pool = require("../config/mysql");

const getAllVisitors = async () => {
  try {
    const [rows] = await pool.query(`SELECT * from visitors`);
    return { visitors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const getVisitorsByCID = async (CID) => {
  try {
    const [rows] = await pool.query(`SELECT * from visitors WHERE CID = '${CID}'`);
    return { visitors: rows, count: rows.length };
  } catch (error) {
    return { error: error };
  }
};

const isVisitor = async (CID) => {
  try {
    const [rows] = await pool.query(`SELECT * from visitors WHERE CID = '${CID}'`);
    return rows.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createVisitor = async (cid, initial) => {
  if (!initial || !cid) {
    return { message: "Missing fields." };
  }

  try {
    const [rows] = await pool.query(`INSERT INTO visitors (cid, initial) VALUES (${cid}, '${initial}')`);
    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const updateVisitor = async (cid, initial) => {
  if (!initial || !cid) {
    return { message: "Missing fields." };
  }

  try {
    const [rows] = await pool.query(`UPDATE visitors SET initial='${initial}' WHERE cid=${cid}`);
    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

const deleteVisitor = async (cid) => {
  try {
    const [rows] = await pool.query(`DELETE FROM visitors WHERE cid = '${cid}'`);

    return { result: rows };
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  getAllVisitors,
  getVisitorsByCID,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  isVisitor,
};
