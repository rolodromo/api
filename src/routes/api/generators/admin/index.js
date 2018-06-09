const express = require('express')
const errors = require('restify-errors')
const generators = require('../../../../managers/generators')
const router = express.Router()

const setFeatured = status => (req, res, next) => {
  generators
    .setFeatured(req.params.id, status)
    .then(update => {
      if (!update.ok) {
        return next(errors.InternalServerError('Error during update'))
      }
      return res.sendStatus(204)
    })
    .catch(next)
}

const setListed = status => (req, res, next) => {
  generators
    .setListed(req.params.id, status)
    .then(update => {
      if (!update.ok || !update.nModified) {
        return next(errors.InternalServerError('Error during update'))
      }
      return res.sendStatus(204)
    })
    .catch(next)
}

router.put('/featured/:id', setFeatured(true))
router.delete('/featured/:id', setFeatured(false))

router.put('/listed/:id', setListed(true))
router.delete('/listed/:id', setListed(false))

module.exports = router
