const jwt = require("jsonwebtoken");

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
};

const getParam = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded.username;
  } catch (err) {
    return null;
  }
};

module.exports = { genToken, getParam };
