const shortid = require('shortid')
const slug = require('slug')

const { merge, pull, isEmpty, reduce, map, partialRight, unset } = require('lodash')

const db = require('../db')
const link = require('./link')
const validate = require('./validator')

const userColl = db.get('user_collections')

const DEFAULT_DATA = {
  listed: true,
  featured: false,
  length: 0
}

const dontExists = { $exists: false }
const slugify = str => slug((str || '').toLowerCase())

const prepare = data => {
  if (!data) return

  unset(data, ['_id', 'listed', 'deleted'])
  return link(data)
}
const prepareList = partialRight(map, prepare)
const listOpts = {
  fields: { items: 0 },
  sort: { createdAt: -1 }
}

const findAll = () => userColl.find({
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findByType = (type) => userColl.find({
  type,
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findOwn = (userId) => userColl.find({
  'author.id': userId,
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findById = id => {
  return userColl
    .findOne({ id, deleted: dontExists })
    .then(prepare)
}

const checkOwner = (user, id) => {
  return userColl.findOne({ id })
    .then(found => {
      return found ? (user.profileId === found.author.id) : false
    })
}

const remove = (id) => {
  return userColl.findOneAndUpdate({ id }, { $set: { deleted: true } })
}

const save = (inputId, inputData) => validate(inputData).then(() => {
  const id = inputId || shortid.generate()

  const data = inputId ? inputData : merge({}, DEFAULT_DATA, inputData)

  const time = inputId ? 'updatedAt' : 'createdAt'
  data[time] = new Date()
  data.slug = slugify(data.name)

  return userColl
    .findOneAndUpdate({
      id,
      deleted: dontExists
    }, {
      $set: data
    }, { upsert: true })
    .then(prepare)
})

const saveItems = (id, saveData = {}, removeData = []) => {
  const setItems = reduce(Object.keys(saveData), (obj, key) => {
    obj[`items.${key}`] = saveData[key]
    return obj
  }, {})

  const removeIds = pull(removeData, ...Object.keys(saveData))
  const unsetItems = reduce(removeIds, (obj, key) => {
    obj[`items.${key}`] = 1
    return obj
  }, {})

  const updateCommands = {}

  if (!isEmpty(setItems)) {
    updateCommands.$set = setItems
  }
  if (!isEmpty(unsetItems)) {
    updateCommands.$unset = unsetItems
  }

  return userColl
    .findOneAndUpdate({
      id,
      deleted: dontExists
    }, updateCommands)
    .then(saved => {
      if (!saved.items) return saved

      return userColl
        .update({
          id,
          deleted: dontExists
        }, {
          $set: {
            length: Object.keys(saved.items).length
          }
        })
        .then(() => saved)
    })
}

module.exports = {
  findAll,
  findByType,
  findOwn,
  findById,
  save,
  remove,
  checkOwner,
  saveItems
}
