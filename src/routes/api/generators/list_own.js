const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators
    .findOwn(req.user.profileId)
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
