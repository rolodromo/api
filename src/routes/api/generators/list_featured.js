const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators.findFeatured()
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
