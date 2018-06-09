const errors = require('restify-errors')
const generators = require('../../../managers/generators')
const notifyFork = require('../../../managers/generators/notifier')

module.exports = (req, res, next) => {
  const author = {
    id: req.user.profileId,
    name: req.user.profile.name,
    picture: req.user.profile.picture
  }

  generators
    .fork(req.params.id, { author })
    .then(forked => {
      if (!forked) {
        return next(new errors.InternalServerError('Error during save'))
      }

      res.status(200).send(forked)
      notifyFork(forked)
    })
    .catch(next)
}
