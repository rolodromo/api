const validator = require('../validator')

const schema = {
  title: 'Collection Table',
  type: 'object',
  properties: {
    name: 'string',
    desc: 'string',
    type: {
      type: 'string',
      enum: ['sound', 'generator', 'dice', 'text']
    },
    author: {
      type: 'object',
      properties: {
        id: 'string',
        name: 'string',
        picture: 'string'
      }
    },
    featured: 'boolean',
    items: {
      type: 'object'
    },
    id: 'string'
  },
  required: ['name', 'desc']
}

module.exports = data => validator(data, schema)
