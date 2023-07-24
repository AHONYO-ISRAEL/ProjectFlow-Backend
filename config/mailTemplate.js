// mailTemplate.js
const jwt = require('jsonwebtoken');
const mailparser = require('mailparser');

const generateEmailTemplate =  async (cryptedMail) => {
  const link = `<a href="http://localhost:5713/auth/credentials/${cryptedMail}">Me connecter</a>`;

  // Create the HTML email content
  const html = `<p>Click on the link to reset your password: ${link}</p>`;

  return  await mailparser.simpleParser(html).then((parsedMail) => parsedMail.html);
};

module.exports = generateEmailTemplate;
