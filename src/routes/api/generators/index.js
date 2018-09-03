const express = require('express')
const cors = require('cors')

const checkOwner = require('../../../middlewares/generators/check_owner')
const validateToken = require('../../../middlewares/validate_token')
const onlyAdmin = require('../../../middlewares/only_admin')

const listAll = require('./list_all')
const listNames = require('./list_names')
const listFeatured = require('./list_featured')
const listTwittable = require('./list_twittable')
const listLiked = require('./list_liked')
const addLike = require('./likes/add')
const removeLike = require('./likes/remove')
const findOne = require('./find_one')
const save = require('./save')
const fork = require('./fork')
const remove = require('./remove')
const admin = require('./admin')

const router = express.Router()
const useCors = cors()
const mandatoryToken = () => validateToken({ required: true })

router.get('/tables', useCors, validateToken(), listAll)
router.get('/tables/names', useCors, validateToken(), listNames)
router.get('/tables/featured', useCors, validateToken(), listFeatured)
router.get('/tables/likes', useCors, mandatoryToken(), listLiked)
router.get('/tables/twitter', useCors, validateToken(), listTwittable)

router.get('/table/:id', useCors, validateToken(), findOne)

router.post('/tables', mandatoryToken(), save)
router.post('/table/:id/fork', mandatoryToken(), fork)
router.put('/table/:id', mandatoryToken(), checkOwner, save)
router.delete('/table/:id', mandatoryToken(), checkOwner, remove)

router.post('/table/:id/like', mandatoryToken(), addLike)
router.delete('/table/:id/like', mandatoryToken(), removeLike)

router.use('/admin', onlyAdmin, admin)

module.exports = router
