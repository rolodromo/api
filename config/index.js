require('dotenv').config()

const {
  PORT,
  HOST,
  MAIL_RECIPIENT,
  MONGODB_URI,
  MONGO_URL,
  TOKEN_SECRET,
  ADMIN_USERS,
  AUTH_ADMIN_INTERNAL_TOKEN,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  BOT_CONSUMER_KEY,
  BOT_CONSUMER_SECRET,
  BOT_ACCESS_TOKEN,
  BOT_ACCESS_TOKEN_SECRET
} = process.env // eslint-disable-line no-process-env

module.exports = {
  name: 'Rolodromo',
  port: PORT,
  host: HOST,
  mailRecipient: MAIL_RECIPIENT,
  database: {
    url: MONGO_URL || MONGODB_URI
  },
  auth: {
    adminToken: AUTH_ADMIN_INTERNAL_TOKEN,
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
  },
  twitter: {
    consumer_key: BOT_CONSUMER_KEY,
    consumer_secret:BOT_CONSUMER_SECRET,
    access_token: BOT_ACCESS_TOKEN,
    access_token_secret: BOT_ACCESS_TOKEN_SECRET,
    screen_name: 'roleandobot'
  }
}
