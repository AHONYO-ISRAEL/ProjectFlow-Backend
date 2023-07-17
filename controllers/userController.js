const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const  auth = require('../middlewares/auth.js')
const User = db.user;
const Role = db.role


// Load environment variables from .env file
dotenv.config();

/*
generateRefreshTokenSecret = () => {
  // Generation of UUID
  const uuid = uuidv4();

  // Create secret key
  const secretKey = uuid;

  // Store the secret key in an environment variable
  process.env.REFRESH_TOKEN_SECRET= secretKey;
  
  // Write the secret key to the .env file
  const envData = `REFRESH_TOKEN_SECRET=${secretKey}\n`;
  fs.appendFileSync('.env', envData);
};
*/



exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(401).json('Email already registered. Please try logging in.');
    } else {
      const role = await Role.findOne({ where: { roleName: req.body.roleName } });
      const roleUuid = role.uuid
      const roleId = role.id
       const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        roleUuid: roleUuid,
        roleId: roleId
      };
      console.log(roleId)

      const createdUser = await User.create(newUser);
      return res.status(200).json({ user: createdUser });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const generateAccessToken =(user)=>{
  return  jwt.sign({ userId: user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }) 
}

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    const userRoleUuid =  user.roleUuid
    const roleRow= await Role.findOne({where:{uuid: userRoleUuid}})
    console.log(roleRow.id)
    const userRole = roleRow.roleName
    if (!user) {
      return res.status(400).json({ message: 'User with this email not found.' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    const accesstoken =generateAccessToken(user)
const refreshtoken = jwt.sign({ userId: user.uuid}, process.env.REFRESH_TOKEN_SECRET)
console.log(user.username) 
    res.status(200).json({ userId: user.uuid, userName: user.username , accessToken:accesstoken , refreshToken:refreshtoken, role: userRole});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 

exports.getUser = auth, (req,res)=>{
  res.send(req.auth)
}
