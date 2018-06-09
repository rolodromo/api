const express = require('express')
const errors = require('restify-errors')

const generators = require('../managers/generators')
const router = express.Router()

router.get('/rg/:id', (req, res, next) => {
  generators
    .findById(req.params.id)
    .then(generator => {
      if (!generator) {
        return next(new errors.NotFoundError('Generator not found'))
      }

      return res.redirect(301, generator.link)
    })
    .catch(next)
})

module.exports = router
