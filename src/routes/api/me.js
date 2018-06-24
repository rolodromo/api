const express = require('express')

const validateToken = require('../../middlewares/validate_token')
const mandatoryToken = () => validateToken({ required: true })
const listOwn = require('../api/generators/list_own')
const listOwnColls = require('../api/collections/list_own')
const listLiked = require('../api/generators/list_liked')

const router = express.Router()

router.use(mandatoryToken())

// Just validate token
router.get('/', function(req, res) {
  res.send(req.user)
})
router.get('/tables', listOwn)
router.get('/tables/favorites', listLiked)

router.get('/collections', listOwnColls)

module.exports = router
