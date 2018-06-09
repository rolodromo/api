const errors = require('restify-errors')

const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators
    .remove(req.params.id)
    .then(item => {
      if (!item || !item.deleted) {
        return next(errors.InternalServerError('Error during generator remove'))
      }
      res.sendStatus(204)
    })
    .catch(next)
}
