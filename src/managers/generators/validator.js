const validator = require('../validator')

const schema = {
  title: 'Generator Table',
  type: 'object',
  properties: {
    name: 'string',
    desc: 'string',
    author: {
      type: 'object',
      properties: {
        id: 'string',
        name: 'string',
        picture: 'string'
      }
      // required: ['id', 'name']

    },
    parent: 'string',
    listed: 'boolean',
    featured: 'boolean',
    data: {
      type: 'object',
      properties: {
        remotes: 'string',
        tpls: 'string',
        tables: 'string'
      },
      required: ['tables']
    },
    id: 'string'
  },
  required: ['name', /* 'author', */ 'data']
}

module.exports = data => validator(data, schema)
