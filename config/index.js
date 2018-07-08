require('dotenv').config()

const {
  PORT,
  HOST,
  MAIL_RECIPIENT,
  MONGODB_URI,
  TOKEN_SECRET,
  ADMIN_USERS,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD
} = process.env // eslint-disable-line no-process-env

module.exports = {
  name: 'Rolodromo',
  port: PORT,
  host: HOST,
  mailRecipient: MAIL_RECIPIENT,
  database: {
    url: MONGODB_URI
  },
  auth: {
    token: {
      secret: TOKEN_SECRET,
      audience: 'api.rolodromo.com',
      issuer: 'api.rolodromo.com',
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
    clientId: AUTH0_CLIENT_ID
  },
  sendgrid: {
    user: SENDGRID_USERNAME,
    pass: SENDGRID_PASSWORD
  }
}
