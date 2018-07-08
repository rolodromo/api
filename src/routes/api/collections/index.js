const express = require('express')
const cors = require('cors')

const findAll = require('./list_all')
const findByType = require('./list_by_type')
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
router.get('/sounds', validateToken(), findByType('sounds'))
router.get('/generators', validateToken(), findByType('generators'))
router.get('/dice', validateToken(), findByType('dice'))

router.post('/:type', validateToken(), save)

// single collection
router.get('/:id', validateToken(), findOne)
router.put('/:id', validateToken(), checkOwner, save)
router.delete('/:id', mandatoryToken(), checkOwner, remove)

// items
router.post('/:id/items', mandatoryToken(), checkOwner, saveItems)

module.exports = router
