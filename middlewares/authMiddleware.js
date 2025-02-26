const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendResponse = require("@utils/sendResponse.js");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, 401, null, "Access denied. No token provided.");
  }

  // Extract token after 'Bearer '
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 400, null, "Invalid token");
  }
};

module.exports = authMiddleware;
