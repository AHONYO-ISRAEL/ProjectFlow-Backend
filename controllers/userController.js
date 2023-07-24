const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

const sendMail = require('../config/mailing.controller.js')
const mailparser = require('mailparser'); 

const db = require('../models');
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
  } catch (error) {
    return res.status(500).json({error });
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
    res.status(200).json({ userId: user.id, userName: user.username , accessToken:accesstoken , refreshToken:refreshtoken, role: userRole});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 


exports.getClients = async (req, res)=>{
  try{
    const clientRole =  await Role.findOne({where: {roleName : 'client'}})
    const  clientRoleId = clientRole.id
    const clientUsers = await  User.findAll({where:{roleId:clientRoleId}})
    clientUsers ?  res.status(200).json({clients: clientUsers}) : res.status(404).json({message : 'No client found'})
  }catch(err){
    return res.status(500).json({ error: err.message });

  }
}


exports.sendMail = async  (req,res) =>{
  const userMailCrypted =     jwt.sign({ email: req.body.email}, process.env.USER_INFO_TOKEN) 

  const html = `<a href="http://localhost:5713/auth/credentials/${userMailCrypted}">Me connecter</a>`;
  const message =await mailparser.simpleParser(html).then((parsedMail) => parsedMail.html);

  const recipient = req.body.email
  const subject = 'Your Password'
  const text =  message

 try{  
   sendMail(recipient, subject, text)  
  res.status(200).json('success')
}catch(error){res.status(500).json({error})}
  
} 