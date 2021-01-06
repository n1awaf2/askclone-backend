const jwt = require("jsonwebtoken");

const genTokens = (id, key) => {
  const newAccessToken = jwt.sign(
    { userId: id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15s" }
  );
  const newRefreshToken = jwt.sign(
    { userId: id },
    process.env.REFRESH_TOKEN_SECRET + key,
    { expiresIn: "7d" }
  );
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = genTokens;
