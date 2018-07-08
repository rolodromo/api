const errors = require('restify-errors')
const pick = require('lodash/pick')
const merge = require('lodash/merge')
const userColl = require('../../../managers/collections')
const notifyNew = require('../../../managers/collections/notifier')

module.exports = (req, res, next) => {
  const author = {
    id: req.user.profileId,
    name: req.user.profile.name,
    picture: req.user.profile.picture
  }
  let data = {}
  const isNew = !(req.params.id)
  const pickProps =['name', 'desc', 'items']
  if (isNew) {
    pickProps.push(['type'])
  }
  const table = pick(req.body, pickProps)

  if (isNew) {
    data = merge({ author }, {
      ...table,
      type: req.params.type,
      length: Object.keys(table.items).length
    })
  } else {
    // Do NOT modify author data if current user isAdmin
    data = req.isAdmin ? table : merge({ author }, table)
  }

  userColl.save(req.params.id, data)
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
