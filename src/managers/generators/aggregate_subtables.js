const { flatMap, pick, has } = require('lodash')
const db = require('../db')

const generators = db.get('generator_tables')

module.exports = (main) => {
  main.children = {}
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
      main.children = formatChildren(main, list)
      return main
    })
    .catch(err => {
      console.log(err)
      return main
    })
}

const formatChildren = (main, list) => {

  const gens = list.reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  return objToArray(main.data.alias)
    .concat(flatMap(list.filter(x => x.alias).map(x => objToArray(x.alias))))
    .reduce((acc, curr) => {
      acc[curr.alias] = pick(gens[curr.id], ['tpls', 'tables'])
      return acc
    }, {})
}

const objToArray = obj => {
  if (!obj) return []

  return Object.keys(obj).map(key => {
    return { alias: key, id: obj[key] }
  })
}
