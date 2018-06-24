const errors = require('restify-errors')

const userColl = require('../../../managers/collections')

module.exports = (req, res, next) => {
  userColl.remove(req.params.id)
    .then(item => {
      if (!item || !item.deleted) {
        return next(errors.InternalServerError('Error during collection remove'))
      }
      res.sendStatus(204)
    })
    .catch(next)
}
