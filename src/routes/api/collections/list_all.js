const userColl = require('../../../managers/collections')

module.exports = (req, res, next) => {
  userColl.findAll()
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
