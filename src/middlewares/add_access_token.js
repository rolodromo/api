const { has } = require('lodash')

module.exports = (req, res, next) => {
  if (!has(req, 'headers.authorization')) {
    return next()
  }

  req.accessToken = req.headers.authorization.replace('Bearer ', '')
  return next()
}
