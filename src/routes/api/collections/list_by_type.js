const userColl = require('../../../managers/collections')

module.exports = type => (req, res, next) => {
  userColl.findByType(type)
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
