const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators.findAll()
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
