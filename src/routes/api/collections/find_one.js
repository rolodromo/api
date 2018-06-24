const errors = require('restify-errors')

const userColl = require('../../../managers/collections')

module.exports = (req, res, next) => {
  userColl
    .findById(req.params.id)
    .then(generator => {
      if (!generator) {
        return next(errors.NotFoundError('Collection not found'))
      }
      res.status(200).send(generator)
    })
    .catch(next)
}
