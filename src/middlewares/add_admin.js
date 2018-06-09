const users = require('../managers/user')

module.exports = (req, res, next) => {
  if (!req.user) {
    return next()
  }
  req.isAdmin = users.isAdmin(req.user)
  return next()
}
