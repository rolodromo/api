const { NO_CONTENT } = require('http-status')
const { tweet } = require('../../../managers/twtitter/client')

const generators = require('../../../managers/generators')
const engine = require('../../../managers/generators/engine')

module.exports = (req, res, next) => {
  generators
    .findRandomTwittable()
    .then(async data => {

      const generator = engine.makeGenerator(data)

      await tweet({
        status: await engine.generateTwittable({ generator }),
        dryRun: req.body.dryRun
      })
      res.sendStatus(NO_CONTENT)
    })
    .catch(next)
}
