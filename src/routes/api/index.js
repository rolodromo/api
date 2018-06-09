const express = require('express')
const router = express.Router()

router.use('/me', require('./me'))
router.use('/generators', require('./generators'))

module.exports = router
