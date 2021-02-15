const jwt = require("jsonwebtoken");
const client = require("../../db");
const genTokens = require('../helpers/genTokens')


const protect = async (req, res, next) => {
//get access token from headers
  const accessToken = req.headers["access-token"].split(" ")[1];
// verify access token
  try {
    const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("Access token valid" + new Date());
    req.user = verified["userId"];
  } catch (error) {
//if access token isn't verified we try to verify refresh token
    const accessToken = await req.headers["access-token"].split(" ")[1];
    const refreshToken = await req.headers["refresh-token"];
    const userId = jwt.decode(accessToken).userId;
    const hashedPassword = (
      await client.query(
        "SELECT user_password FROM users_credentials WHERE user_id = $1",
        [userId]
      )
    ).rows[0].user_password;
    try {
      const verified = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET + hashedPassword
      );
//if refresh token is valid we sign new tokens
      if (verified.userId === userId) {
        console.log("refresh verified");
        const newTokens = genTokens(userId, hashedPassword);
//set headers with new tokens
        res.set("Access-Control-Expose-Headers", "access-token, refresh-token");
        res.set("access-token", newTokens.accessToken);
        res.set("refresh-token", newTokens.refreshToken);
        res.set('isrefreshed', 'true')
        req.user = userId;
      }
    } catch (error) {
      console.log("refresh not verified");
      return res.status(401).json("Unauthorized");
    }
  }

  next();
};

module.exports = protect;