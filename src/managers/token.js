import ms from 'ms'
import jwt from 'jsonwebtoken'

import config from '../../config'

const createTokens = (profileId, profile) => {
  const aToken = config.auth.token
  const rToken = config.auth.refreshToken
  const secret = aToken.secret
  const expiresIn = ms(aToken.expiresIn) / 1000

  const accessToken = jwt.sign({ profileId, profile }, secret, {
    expiresIn: aToken.expiresIn,
    audience: aToken.audience,
    issuer: aToken.issuer
  })

  const refreshToken = jwt.sign({
    profileId,
    refreshToken: true
  }, secret, {
    expiresIn: rToken.expiresIn,
    audience: aToken.audience,
    issuer: aToken.issuer
  })

  return { accessToken, refreshToken, expiresIn }
}

module.exports = {
  createTokens
}
