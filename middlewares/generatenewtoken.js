const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const auth = require('./auth.js');

// Load environment variables from .env file
dotenv.config();

module.exports = [auth, (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decodedRefreshToken.userId;
    
    if (userId) {
      const accessToken = req.body.accessToken;
      const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const expirationTime = decodedAccessToken.exp;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const timeBeforeRefresh = 60; // 1 minute
      
      const expirationTimeInSeconds = expirationTime - currentTime;
      
      if (expirationTimeInSeconds <= timeBeforeRefresh) {
        const newAccessToken = jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({newAccessToken :newAccessToken })
        // Log the new authorization header 
      }
      
      req.data = {
        userId: userId,
        accessToken: accessToken,
        accessTokenExp: expirationTime,
        expirationTime: expirationTimeInSeconds,
      };
      
      next();
    } else {
      throw new Error('Invalid user ID');
    }
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}];
