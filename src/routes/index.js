import express from 'express'
const cors = require('cors')

const sitemap = require('./sitemap')
const auth = require('./auth')
const api = require('./api')
const short = require('./short')
const validateToken = require('../middlewares/validate_token')

const router = express.Router()

const addAdmin = require('../middlewares/add_admin')
const addAccessToken = require('../middlewares/add_access_token')

router.get('/ping', (req, res) => {
  res.send({
    hello: 'world!'
  })
})

router.use(addAccessToken)
router.use('/auth', cors(), auth)
router.use('/api', cors(), validateToken(), addAdmin, api)
router.use(short)

router.use(sitemap)

module.exports = router
