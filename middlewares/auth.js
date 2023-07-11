const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');


// Load environment variables from .env file
dotenv.config();

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token,   process.env.SECRET_KEY )
        const userId = decodedToken.userId
        req.auth={
            userId: userId
        }
        next()
    }catch(error){
        res.status(401).json({error})
    }
}