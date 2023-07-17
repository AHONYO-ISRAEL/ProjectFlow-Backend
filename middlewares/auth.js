const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();

module.exports = (req, res, next) =>{
    try{
        const accesstoken = req.body.accessToken
        const decodedAccessToken = jwt.verify(accesstoken,   process.env.ACCESS_TOKEN_SECRET )
        const userId = decodedAccessToken.userId
        req.auth={
            userId: userId,
            exp: decodedAccessToken.exp,
 }

   
        next()
    }catch(error){
        res.status(403).json({message : 'Action Not Allowed '+ error,  })
    }
}

