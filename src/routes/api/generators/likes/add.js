const errors = require('restify-errors')
const generators = require('../../../../managers/generators')

module.exports = (req, res, next) => {
  generators
    .addLike(req.params.id, req.user.profileId)
    .then(saved => {
      if (!saved) {
        return next(new errors.InternalServerError('Error adding like'))
      }

      res.sendStatus(204)
    })
    .catch(next)
}
