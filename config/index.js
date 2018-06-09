require('dotenv').config()

const {
  PORT,
  HOST,
  MAIL_RECIPIENT,
  MONGODB_URI,
  API_BASE_URL,
  TOKEN_SECRET,
  ADMIN_USERS,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CALLBACK_URL,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD
} = process.env // eslint-disable-line no-process-env

module.exports = {
  name: 'Roleando',
  port: PORT,
  host: HOST,
  mailRecipient: MAIL_RECIPIENT,
  database: {
    url: MONGODB_URI
  },
  api: {
    baseUrl: API_BASE_URL
  },
  auth: {
    token: {
      secret: TOKEN_SECRET,
      audience: 'roleando.herokuapp.com',
      issuer: 'roleando.herokuapp.com',
      expiresIn: '5d'
    },
    refreshToken: {
      expiresIn: '30d'
    }
  },
  admin: {
    users: ADMIN_USERS
  },
  auth0: {
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    callbackUrl: AUTH0_CALLBACK_URL
  },
  sendgrid: {
    user: SENDGRID_USERNAME,
    pass: SENDGRID_PASSWORD
  }
}
