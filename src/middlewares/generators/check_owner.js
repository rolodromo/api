const errors = require('restify-errors')

const generators = require('../../managers/generators')

module.exports = (req, res, next) => {
  if (req.isAdmin) {
    return next()
  }

  generators
    .checkOwner(req.user, req.params.id)
    .then(isOwner => {
      if (!isOwner) {
        return next(new errors.UnauthorizedError("Can't modify this generator"))
      }
    })
    .then(() => next())
    .catch(next)
}
