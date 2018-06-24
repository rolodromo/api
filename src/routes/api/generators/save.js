const errors = require('restify-errors')
const pick = require('lodash/pick')
const merge = require('lodash/merge')
const generators = require('../../../managers/generators')
const notifyNew = require('../../../managers/generators/notifier')

module.exports = (req, res, next) => {
  const author = {
    id: req.user.profileId,
    name: req.user.profile.name,
    picture: req.user.profile.picture
  }
  let data = {}
  const table = pick(req.body, ['name', 'desc', 'data.tables', 'data.tpls', 'data.alias'])
  const isNew = !(req.params.id)

  if (isNew) {
    data = merge({ author }, table)
  } else {
    // Do NOT modify author data if current user isAdmin
    data = req.isAdmin ? table : merge({ author }, table)
  }

  generators.save(req.params.id, data)
    .then(saved => {
      if (!saved) {
        return next(new errors.InternalServerError('Error during save'))
      }

      res.status(200).send(saved)

      if (!req.params.id) {
        notifyNew(saved)
      }
    })
    .catch(next)
}
