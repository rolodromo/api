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
  const { format, total, stripTags, stripHeader, contentType } = cleanParams(req.query)

  generators
    .findById(req.params.id)
    .then(data => {
      if (!data) {
        return next(errors.NotFoundError('Generator not found'))
      }
      const generator = engine.makeGenerator(data)

      let result = range(total).map(_ => engine.generateFormatted({ generator, stripHeader, stripTags }))

      if (format !== 'json') {
        result = result.join('\n\n')
      }
      res.status(200)
        .set({
          'Content-type': contentType
        })
        .send(result)
    })
    .catch(next)
}
