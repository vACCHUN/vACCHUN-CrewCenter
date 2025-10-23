const pool = require("../config/mysql");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const token = authHeader.split(" ")[1];

    const [rows] = await pool.query("SELECT * FROM ATCOs WHERE access_token = ? LIMIT 1", [token]);

    if (!rows || rows.length === 0) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    req.user = rows[0];

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
