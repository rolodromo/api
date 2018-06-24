const errors = require('restify-errors')

const userColl = require('../../managers/collections')

module.exports = (req, res, next) => {
  if (req.isAdmin) {
    return next()
  }

  userColl.checkOwner(req.user, req.params.id)
    .then(isOwner => {
      if (!isOwner) {
        return next(new errors.UnauthorizedError('Can\'t modify this collection'))
      }
    })
    .then(next, next)
}
