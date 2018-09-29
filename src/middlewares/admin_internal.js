const { BAD_REQUEST } = require('http-status')
const config = require('../../config')

module.exports = (req, res, next) => {
  if (!req.headers['x-admin-token'] || !req.headers['x-admin-token'] === config.auth.adminToken) {
    res.status(BAD_REQUEST).send({
      code: BAD_REQUEST,
      message: 'Missing or invalid admin token'
    })
    return
  }
  return next()
}
