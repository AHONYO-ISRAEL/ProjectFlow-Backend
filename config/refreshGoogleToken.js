require('dotenv').config()
const { google } = require('googleapis');
const readline = require('readline');

// Remplacez les valeurs suivantes par les informations de votre application
const clientId = process.env.OAUTH2_CLIENT_ID;
const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
const redirectUri = process.env.OAUTH2_REDIRECT_URI;
const scope = ['https://mail.google.com/']; // Scopes d'autorisation nécessaires pour Gmail

// Configuration de l'OAuth2 client
const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Génère l'URL d'autorisation
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // Pour obtenir un refresh token
  scope: scope
});

console.log('Autorisez cette application en visitant cette URL : ', authUrl);

// Crée une interface pour la lecture de l'entrée utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Demande à l'utilisateur de saisir le code d'autorisation
rl.question('Entrez le code d\'autorisation : ', async (code) => {
  // Échange le code d'autorisation contre un ensemble de tokens
  const { tokens } = await oAuth2Client.getToken(code);

  // Affiche le refresh token
  console.log('Refresh Token : ', tokens.refresh_token);

  rl.close();
});