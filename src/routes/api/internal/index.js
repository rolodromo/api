const express = require('express')
const bodyParser = require('body-parser')

const adminInternalOnly = require('../../../middlewares/admin_internal')
const tweet = require('./tweet')
const tweetStorycubes = require('./tweet_storycubes')


const router = express.Router()
router.use(bodyParser.json())
router.use('/', adminInternalOnly)
router.post('/tweet', tweet)
router.post('/tweet-storycubes', tweetStorycubes)

module.exports = router
