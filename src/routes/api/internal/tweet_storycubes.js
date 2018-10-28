const { NO_CONTENT } = require('http-status')
const { tweetStorycubes } = require('../../../managers/twtitter/client')

module.exports = async (req, res, next) => {
  try {
    await tweetStorycubes({
      dryRun: req.body.dryRun
    })
    res.sendStatus(NO_CONTENT)
  } catch (err) {
    return next(err)
  }
}
