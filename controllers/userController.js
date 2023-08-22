const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const sendMail = require('../config/mailing.controller.js')

const db = require('../models');
const  auth = require('../middlewares/auth.js')
const User = db.user;
const Role = db.role
const Developer = db.developer 
const Project = db.project
const Task = db.task
const Section = db.section
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
      const roleId = role.id
       const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        roleId: roleId
      };

      const createdUser = await User.create(newUser);
      const newCreatedUser = await User.findOne({where:{email:req.body.email}})
     
      return res.status(200).json({ newUser: newCreatedUser });
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
    const userRoleId =  user.roleId
    const roleRow= await Role.findOne({where:{id: userRoleId}})
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

exports.getClientsWithProjects = async (req, res) => {
  try {
    const clientRole = await Role.findOne({ where: { roleName: 'client' } });
    const clientRoleId = clientRole.id;

    const clients = await User.findAll({
      where: { roleId: clientRoleId },
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }, // Exclude the join table attributes
          as: 'projects', // Alias for the association to avoid naming conflict
        },
      ],
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error ' + error });
  }
};


exports.getDevs= async (req, res)=>{
  try{
  const devRole =  await Role.findOne({where: {roleName : 'developer'}})
  
    const  devRoleId = devRole.id
    const devUsers = await  User.findAll({where:{roleId:devRoleId}})
    devUsers ?  res.status(200).json({developers: devUsers}) : res.status(404).json({message : 'No Developer  found'})
  }catch(err){
    return res.status(500).json({ error: err.message });

  }
}

exports.getDevsInfo = async (req, res) => {
  try {
    const developers = await Developer.findAll({
      attributes: ['id', 'email'],
      include: [
        { 
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Project,
          attributes: ['id', 'name'],
          include: [
            {
              model: Section,
              attributes: ['id', 'name'],
              include: [
                {
                  model: Task,
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    }); 

    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error ' + error });
  }
};


exports.sendMail = async  (req,res, next) =>{
const userId = req.body.userId
const cryptedUserInfo = jwt.sign({userId: userId}, process.env.USER_INFO_TOKEN)

  const url = `http://localhost:5173/auth/credentials?userToken=${cryptedUserInfo}`
 const message="Se connecter avec mon compte"

  const recipient = req.body.email
  const subject = 'Set Your  Password'
  const text =  message 
  const html ="<a href=  ' " + url   +    " '>Me connecter</a>";

 try{  
  if(sendMail(recipient, subject, text, html))
  res.status(200).json('success')
}catch(error){res.status(500).json({error})}
  next()
} 
 

exports.getUserByToken = async (req, res) => {
  try {
    const email = req.query.userToken;

    //const decryptedToken = jwt.verify(encryptedToken, process.env.USER_INFO_TOKEN);
    const user = await User.findOne({where:{ email: email }});
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Invalid or expired token' +error});
  }
};


exports.sendCredentials = async(req, res)=>{
try{
const userToken = req.params.userToken
const decodedUserToken = jwt.verify(userToken,   process.env.USER_INFO_TOKEN )
const userId = decodedUserToken.userId
if(userId){
  const credentials = await User.findOne({where:{id:userId}})
  res.status(200).json({credentials:credentials})
}
}catch(error){
  res.status(500).json({ error});

}
}



exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    
    if (userData.password) {
      // Hash the new password
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const updatedUser = await User.update(userData, { where: { id: userId } });
    
    if (updatedUser[0] === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    } else {
      res.status(200).json({ message: 'Informations utilisateur mises à jour' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des informations utilisateur' });
  }
};
