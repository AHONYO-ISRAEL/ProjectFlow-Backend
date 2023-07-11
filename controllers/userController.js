const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const fs = require('fs');

const User = db.user;

// Load environment variables from .env file
dotenv.config();

generateSecretKey = () => {
  // Generation of UUID
  const uuid = uuidv4();

  // Create secret key
  const secretKey = uuid;

  // Store the secret key in an environment variable
  process.env.SECRET_KEY = secretKey;

  // Write the secret key to the .env file
  const envData = `SECRET_KEY=${secretKey}\n`;
  fs.appendFileSync('.env', envData);
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(401).json('Email already registered. Please try logging in.');
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };
      const createdUser = await User.create(newUser);
      return res.status(200).json({ user: createdUser });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ message: 'User with this email not found.' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
