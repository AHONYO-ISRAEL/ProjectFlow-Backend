require('dotenv').config()
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const mailparser = require('mailparser'); 
const generateEmailTemplate = require('./mailTemplate');

const createTransport = async () => {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      process.env.OAUTH2_CLIENT_ID,
      process.env.OAUTH2_CLIENT_SECRET,
      process.env.OAUTH2_REDIRECT_URI
    );
   
    oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH2_REFRESH_TOKEN,
    });
  
    try {
      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            console.error("Erreur lors de l'obtention du jeton d'accès :", err);
            reject(err);
          }
          resolve(token);
        });
      });
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          type: "OAuth2",
          user: process.env.OAUTH2_USER_EMAIL,
          accessToken,
          clientId: process.env.OAUTH2_CLIENT_ID,
          clientSecret: process.env.OAUTH2_CLIENT_SECRET,
          refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
        },
      });
  
      return transporter;
    } catch (err) {
      console.error("Erreur lors de la création du transporteur de courrier électronique :", err);
      throw new Error("Une erreur s'est produite lors de la création du transporteur de courrier électronique.");
    }
  };

  const sendMail = async (recipient, subject, text) => {
    try {
      const emailTransporter = await createTransport();
      if (!emailTransporter) {
        throw new Error("Erreur lors de la création du transporteur de courrier électronique.");
      }
  

      const mailOptions = {
        from: 'edpflow.noreply@gmail.com',
        to: recipient,
        subject: subject,
        text: text, // Use the generated HTML content
      };
  
      await emailTransporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error('Une erreur s\'est produite lors de l\'envoi du courrier :', err);
      return false;
    }
  };
  
  


module.exports = sendMail