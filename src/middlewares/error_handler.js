// eslint-disable no-console

const errors = require('restify-errors')

module.exports = (err, req, res, next) => {
  console.log(err, err.message, err.stack)

  if (req.header('content-type') === 'application/json') {
    if (err instanceof errors.HttpError) {
      res.status(err.statusCode).send(err.body)
      return
    }
    // console.log(err, err.message, err.stack)
    res.status(500).send(new errors.InternalServerError(err).body)
    return
  }
  // console.log(err, err.message, err.stack)
  res.status(500).send(err.message || 'Something broke!')
}
