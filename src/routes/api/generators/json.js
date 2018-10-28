import { has, map } from 'lodash'

const errors = require('restify-errors')
const { intersection, clamp, get, range } = require('lodash')
const generators = require('../../../managers/generators')
const engine = require('../../../managers/generators/engine')

const FORMATS = ['text', 'json']
const CONTENT_TYPE = {
  html: 'text/html',
  json: 'application/json',
  text: 'text/plain'
}
const MAX_GENERATIONS = 100

const cleanParams = (query) => {
  const format = intersection([get(query, 'format')], FORMATS)[0] || 'html'
  return {
    format,
    total: clamp(get(query, 'total', 1), 1, MAX_GENERATIONS),
    stripHeader: !(get(query, 'header', false)),
    stripTags: has(query, 'strip_tags') ? get(query, 'strip_tags') === '1' : format !== 'html',
    perPage: clamp(get(query, 'per_page', 12), 16),
    contentType: CONTENT_TYPE[format]
  }
}

module.exports = async (req, res, next) => {
  const { format, contentType, total, stripHeader, stripTags } = cleanParams(req.query)

  console.log({ format, contentType, total, stripHeader, stripTags })

  let data
  try {
    data = await generators.findById(req.params.id)
    if (!data) {
      return next(errors.NotFoundError('Generator not found'))
    }
  } catch (e) {
    console.error(e)
    return next(e)
  }

  const generator = engine.makeGenerator(data)
  const rows = map(range(total), _ => engine.generateFormatted({
    generator,
    stripHeader,
    stripTags
  }).replace(/<p><br><\/p>/g, ''))

  res.send(rows)
}
