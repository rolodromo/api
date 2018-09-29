const express = require('express')
const bodyParser = require('body-parser')

const adminInternalOnly = require('../../../middlewares/admin_internal')
const tweet = require('./tweet')


const router = express.Router()
router.use(bodyParser.json())
router.use('/', adminInternalOnly)
router.post('/tweet', tweet)

module.exports = router
