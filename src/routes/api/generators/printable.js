import { chunk } from 'lodash'

const errors = require('restify-errors')
const { intersection, clamp, get, range } = require('lodash')
const generators = require('../../../managers/generators')
const engine = require('../../../managers/generators/engine')

const FORMATS = ['html', 'text', 'json  ']
const CONTENT_TYPE = {
  html: 'text/html',
  json: 'application/json',
  text: 'text/plain'
}
const MAX_GENERATIONS = 100

const cleanParams = (query) => {
  const format = intersection([get(query, 'format')], FORMATS)[0] || 'text'
  return {
    format,
    total: clamp(get(query, 'total', 1), 1, MAX_GENERATIONS),
    stripHeader: !(get(query, 'header', false)),
    stripTags: format !== 'html',
    contentType: CONTENT_TYPE[format]

  }
}

module.exports = (req, res, next) => {
  const { total, stripHeader } = cleanParams(req.query)

  generators
    .findById(req.params.id)
    .then(data => {
      if (!data) {
        return next(errors.NotFoundError('Generator not found'))
      }
      const generator = engine.makeGenerator(data)

      const cards = range(total).map(_ => engine.generateFormatted({ generator, stripHeader, stripTags: false }).replace(/<p><br><\/p>/g, ''))

      console.log(cards)
      const pages = chunk(cards, 12)
      res.render('printable', { pages })
    })
    .catch(next)
}
