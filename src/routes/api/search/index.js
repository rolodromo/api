const express = require('express')

const cors = require('cors')
const freesound = require('./freesound')

const config = require('../../../../config')

const ORIGINS = [
  config.ENV !== 'production' ? '*' : '*.rolodromo.com'
]
const mCors = cors({
  methods: ['GET', 'OPTIONS'],
  origin: ORIGINS.join(', ')
})

const router = express.Router()
router.get('/freesound', mCors, freesound)

module.exports = router
