const express = require('express')
const cors = require('cors')

const findAll = require('./list_all')
const findOne = require('./find_one')
const save = require('./save')
const remove = require('./remove')
const saveItems = require('./saveItems')

const validateToken = require('../../../middlewares/validate_token')

// const checkOwner = require('../../../middlewares/generators/check_owner')

const mandatoryToken = () => validateToken({required: true})

const router = express.Router()
router.use(cors())

router.get('/', validateToken(), findAll)
router.post('/', validateToken(), save)

// single collection
router.post('/:id', validateToken(), save)
router.get('/:id', validateToken(), findOne)
router.delete('/:id', mandatoryToken(), remove)

// items
router.post('/:id/items', mandatoryToken(), saveItems)

module.exports = router
