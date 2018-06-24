const { has, find, filter, merge } = require('lodash')
const db = require('../db')

const generators = db.get('generator_tables')

module.exports = (main) => {
  if (!main || !has(main, 'data.alias')) return main

  return generators.aggregate([
    {
      $match: { id: main.id }
    },
    {
      $unwind: '$data.remotes'
    },
    {
      $graphLookup: {
        from: 'generator_tables',
        startWith: '$data.remotes',
        connectFromField: 'data.remotes',
        connectToField: 'id',
        as: 'child',
        maxDepth: 10
        // TODO: restrict only to support tables
        // restrictSearchWithMatch: { "support" : true }
      }
    },
    {
      $unwind: '$child'
    },
    {
      $project: {
        'id': 1,
        'data.alias': 1,
        'child.name': 1,
        'child.id': 1,
        'child.data.alias': 1,
        'child.data.tpls': 1,
        'child.data.tables': 1
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          alias: '$child.data.alias',
          id: '$child.id',
          name: '$child.name',
          tpls: '$child.data.tpls',
          tables: '$child.data.tables'

        }
      }
    }
  ])
    .then(list => {
      if (!list) return main

      return addFlattenAliases(main, list)
    })
    .catch(err => {
      console.log(err)
      return main
    })
}

const addFlattenAliases = (main, list) => {
  const map = mapAliases(Object.keys(main.data.alias), main.data.alias, list)

  main.data.children = filter(list, 'alias')
    .reduce((final, curr) => {
      if (!curr.alias) return final

      return merge(final, mapAliases(Object.keys(curr.alias), curr.alias, list))
    }, map)

  return main
}

const mapAliases = (keys, alias, list) => {
  return keys.reduce((final, curr) => {
    final[curr] = find(list, item => item.id === alias[curr])
    return final
  }, {})
}
