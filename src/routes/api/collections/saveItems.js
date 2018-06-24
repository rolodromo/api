const errors = require('restify-errors')
const pick = require('lodash/pick')

const userColl = require('../../../managers/collections')

module.exports = (req, res, next) => {
  const { save, remove } = pick(req.body, ['save', 'remove'])

  userColl.saveItems(req.params.id, save, remove)
    .then(saved => {
      if (!saved || !saved.items) {
        return next(new errors.InternalServerError('Error during save'))
      }

      res.sendStatus(204)
    })
    .catch(next)
}
