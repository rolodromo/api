const express = require('express')
const router = express.Router()

router.use('/me', require('./me'))
router.use('/generators', require('./generators'))
router.use('/collections', require('./collections'))
router.use('/_internal', require('./internal'))

module.exports = router
