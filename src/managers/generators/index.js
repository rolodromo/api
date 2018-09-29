const shortid = require('shortid')
const slug = require('slug')
const { omit, clone, map, partialRight, merge } = require('lodash')

const validate = require('./validator')
const link = require('./link')
const db = require('../db')
const addChildrenAggragate = require('./aggregate_subtables')

const DEFAULT_DATA = {
  listed: true,
  featured: false
}
const notDeleted = { deleted: { $exists: false } }

const generators = db.get('generator_tables')
const slugify = str => slug((str || '').toLowerCase())

const prepare = obj => {
  if (!obj) return

  const table = omit(obj, ['_id', 'listed', 'deleted'])

  table.children = obj.children || {}
  return link(table)
}

const prepareList = partialRight(map, prepare)

const listOpts = {
  fields: { data: 0 },
  sort: { createdAt: -1 }
}

const findAll = () => generators.find({
  listed: true,
  ...notDeleted
}, listOpts).then(prepareList)

const findNames = () => generators.find({
  ...notDeleted
}, {
  fields: { name: 1, desc: 1, id: 1 },
  sort: { slug: 1 }
}).then(prepareList)

const findOwn = (userId) => generators.find({
  'author.id': userId,
  ...notDeleted
}, listOpts).then(prepareList)

const findLikes = (userId) => generators.find({
  likes: userId,
  listed: true,
  ...notDeleted
}, listOpts).then(prepareList)

const findFeatured = () => generators.find({
  listed: true,
  featured: true,
  ...notDeleted
}, listOpts).then(prepareList)

const findUnlisted = () => generators.find({
  listed: false,
  ...notDeleted
}, listOpts).then(prepareList)

const findTwittable = () => generators.find({
  twittable: true,
  ...notDeleted
}, {
  fields: {
    _id: 0,
    id: 1,
    name: 1
  },
  sort: { createdAt: -1 }
})

const findRandomTwittable = () => {
  return generators
    .aggregate([
      {
        $match: {
          twittable: true,
          ...notDeleted
        }
      },
      { $sample: { size: 1 } }
    ])
    .then(([generator]) => prepare(generator))
}

const findById = id => {
  return generators
    .findOne({ id, ...notDeleted })
    .then(addChildrenAggragate)
    .then(prepare)
}

const save = (inputId, inputData) => validate(inputData).then(() => {
  const id = inputId || shortid.generate()

  const data = inputId ? inputData : merge({}, DEFAULT_DATA, inputData)

  const time = inputId ? 'updatedAt' : 'createdAt'
  data[time] = new Date()
  data.slug = slugify(data.name)
  data.listed = !!(inputData.listed)

  return generators
    .findOneAndUpdate({
      id,
      ...notDeleted
    }, {
      $set: data
    }, { upsert: true })
    .then(prepare)
})

const fork = (id, author) => {
  return generators.findOne({ id, ...notDeleted })
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
  findUnlisted,
  findTwittable,
  findRandomTwittable,
  save,
  fork,
  remove,
  checkOwner,
  setFeatured,
  setListed,
  addLike,
  removeLike
}
