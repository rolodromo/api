const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators.findNames()
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
