const express = require('express')
const errors = require('restify-errors')

const user = require('../managers/user')
const validateRefreshToken = require('../middlewares/validate_refresh_token')

const checkFound = user => {
  if (!user) {
    throw errors.NotFoundError('User not found')
  }
  return user
}

const router = express.Router()

// Note: Exchange an Auth0 accessToken (not the id_token JWT)
router.post('/login', (req, res, next) => {
  if (!req.accessToken) {
    return next(errors.UnauthorizedError('Missing accessToken'))
  }

  user
    .auth0login(req.accessToken)
    .then(user.generateTokens)
    .then(response => {
      res.send(response)
    })
    .catch(next)
})

router.post('/token/refresh', validateRefreshToken, (req, res, next) => {
  if (!req.refreshToken || !req.refreshToken.refreshToken) {
    return next(errors.UnauthorizedError('Missing refreshToken'))
  }

  user
    .findByProfileId(req.refreshToken.profileId)
    .then(checkFound)
    .then(user.generateTokens)
    .then(response => {
      res.send(response)
    })
    .catch(next)
})

module.exports = router
