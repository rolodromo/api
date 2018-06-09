const errors = require('restify-errors')

const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators
    .findById(req.params.id)
    .then(generator => {
      if (!generator) {
        return next(errors.NotFoundError('Generator not found'))
      }
      res.status(200).send(generator)
    })
    .catch(next)
}
