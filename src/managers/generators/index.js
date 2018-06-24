const shortid = require('shortid')
const slug = require('slug')
const merge = require('lodash/merge')
const clone = require('lodash/clone')
const map = require('lodash/map')
const partialRight = require('lodash/partialRight')
const unset = require('lodash/unset')

const validate = require('./validator')
const link = require('./link')
const db = require('../db')
const addChildrenTables = require('./add_children_tables')

const DEFAULT_DATA = {
  listed: true,
  featured: false
}
const dontExists = { $exists: false }

const generators = db.get('generator_tables')
const slugify = str => slug((str || '').toLowerCase())

const prepare = table => {
  if (!table) return

  unset(table, ['_id', 'listed', 'deleted'])
  return link(table)
}
const prepareList = partialRight(map, prepare)
const listOpts = {
  fields: { data: 0 },
  sort: { createdAt: -1 }
}

const findAll = () => generators.find({
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findNames = () => generators.find({
  deleted: dontExists
}, {
  fields: { name: 1, desc: 1, id: 1 },
  sort: { slug: 1 }
}).then(prepareList)

const findOwn = (userId) => generators.find({
  'author.id': userId,
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findLikes = (userId) => generators.find({
  likes: userId,
  listed: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findFeatured = () => generators.find({
  listed: true,
  featured: true,
  deleted: dontExists
}, listOpts).then(prepareList)

const findById = id => {
  return generators
    .findOne({ id, deleted: dontExists })
    .then(addChildrenTables)
    .then(prepare)
}

const save = (inputId, inputData) => validate(inputData).then(() => {
  const id = inputId || shortid.generate()

  const data = inputId ? inputData : merge({}, DEFAULT_DATA, inputData)

  const time = inputId ? 'updatedAt' : 'createdAt'
  data[time] = new Date()
  data.slug = slugify(data.name)

  return generators
    .findOneAndUpdate({
      id,
      deleted: dontExists
    }, {
      $set: data
    }, { upsert: true })
    .then(prepare)
})

const fork = (id, author) => {
  return generators.findOne({ id, deleted: dontExists })
    .then(parent => {
      if (!parent) {
        return
      }

      const newId = shortid.generate()
      const forked = merge(clone(parent), { id: newId, author, parent: parent.id })
      return save(newId, forked)
    })
}

const remove = (id) => {
  return generators.findOneAndUpdate({ id }, { $set: { deleted: true } })
}

const checkOwner = (user, id) => {
  return generators.findOne({ id })
    .then(found => {
      return found ? (user.profileId === found.author.id) : false
    })
}

const setFeatured = (id, featured) => {
  return generators
    .update({ id }, {
      $set: { featured }
    })
}

const setListed = (id, listed) => {
  return generators
    .update({ id }, {
      $set: { listed: listed }
    })
}

const addLike = (id, userId) => {
  return generators
    .update({ id }, {
      $addToSet: { likes: userId }
    })
}

const removeLike = (id, userId) => {
  return generators
    .update({ id }, {
      $pull: { likes: userId }
    })
}

module.exports = {
  findById,
  findNames,
  findAll,
  findOwn,
  findLikes,
  findFeatured,
  save,
  fork,
  remove,
  checkOwner,
  setFeatured,
  setListed,
  addLike,
  removeLike
}
