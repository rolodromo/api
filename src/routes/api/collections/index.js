const express = require('express')
const cors = require('cors')

const findAll = require('./list_all')
const findOne = require('./find_one')
const save = require('./save')
const remove = require('./remove')
const saveItems = require('./saveItems')

const validateToken = require('../../../middlewares/validate_token')

const checkOwner = require('../../../middlewares/collections/check_owner')

const mandatoryToken = () => validateToken({required: true})

const router = express.Router()
router.use(cors())

router.get('/', validateToken(), findAll)
router.post('/', validateToken(), save)

// single collection
router.get('/:id', validateToken(), findOne)
router.post('/:id', validateToken(), checkOwner, save)
router.delete('/:id', mandatoryToken(), checkOwner, remove)

// items
router.post('/:id/items', mandatoryToken(), checkOwner, saveItems)

module.exports = router
