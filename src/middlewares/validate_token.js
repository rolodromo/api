import jwt from 'express-jwt'

import config from '../../config'

const options = config.auth.token

module.exports = ({ required = false } = {}) =>
  jwt({
    secret: options.secret,
    audience: options.audience,
    issuer: options.issuer,
    algorithms: ['HS256'],
    credentialsRequired: !!required
  })
