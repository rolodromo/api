const errors = require('restify-errors')

module.exports = (req, res, next) => {
  if (!req.isAdmin) {
    return next(new errors.UnauthorizedError('Only admins url'))
  }

  return next()
}
