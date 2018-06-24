const userColl = require('../../../managers/collections')

module.exports = (req, res, next) => {
  userColl.findOwn(req.user.profileId)
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
