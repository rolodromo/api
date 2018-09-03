const generators = require('../../../managers/generators')

module.exports = (req, res, next) => {
  generators.findTwittable()
    .then(list => {
      res.send(list)
    })
    .catch(next)
}
