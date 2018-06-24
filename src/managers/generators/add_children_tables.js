const { pick } = require('lodash')
const db = require('../db')
const generators = db.get('generator_tables')
const dontExists = { $exists: false }

module.exports = (generator) => {
  if (!generator) return generator

  return fetchGenerator(generator.id)
    .then(loadChildren)
}

const fetchGenerator = id => generators.findOne({ id, deleted: dontExists })

const loadChildren = (gen, root) => {
  gen.children = {}
  if (!gen || !gen.data.alias) return gen

  root = root || gen
  root._requested = root._requested || [root.id]
  root.children = root.children || {}

  const alias = gen.data.alias
  const aliasNames = Object.keys(gen.data.alias)

  const fetchAll = aliasNames
    .filter(name => !root._requested.includes(alias[name]))
    .map(name => {
      return fetchGenerator(alias[name])
        .then(child => {
          if (!child) {
            return
          }
          root._requested.push(child.id)
          root.children[name] = {
            ...pick(child.data, ['tpls', 'tables'])
          }
          return loadChildren(child, root)
        })
    })

  return Promise.all(fetchAll)
    .then(() => {
      delete root._requested
      return root
    })
}
