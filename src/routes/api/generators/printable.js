import { chunk, has, map } from 'lodash'

const request = require('request')
const errors = require('restify-errors')
const { intersection, clamp, get, range } = require('lodash')
const generators = require('../../../managers/generators')
const engine = require('../../../managers/generators/engine')
const config = require('../../../../config')

const FORMATS = ['html', 'text', 'json', 'pdf', 'pdf_inline', 'png']
const CONTENT_TYPE = {
  html: 'text/html',
  png: 'image/png',
  pdf: 'application/pdf',
  pdf_inline: 'application/pdf',
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
  const { format, contentType, total, stripHeader, stripTags, perPage } = cleanParams(req.query)

  console.log({ format, contentType, total, stripHeader, stripTags, perPage })

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
  const cards = map(range(total), _ => engine.generateFormatted({
    generator,
    stripHeader,
    stripTags
  }).replace(/<p><br><\/p>/g, ''))

  res.contentType(contentType)
  if (format === 'text') {
    res.send(cards.join('\n\n'))
    return
  }

  if (format === 'json') {
    res.send(cards)
    return
  }

  const pages = chunk(cards, perPage)

  res.render('printable', { pages }, async (_, html) => {
    if (format === 'png') {
      request.post({
        uri: `${config.painterUrl}/png`,
        json: true,
        body: {
          content: html
        }
      })
        .pipe(res)
        .on('error', err => {
          return next(err)
        })
      return
    }

    if (format === 'html') {
      res.send(html)
      return
    }

    request.post({
      uri: `${config.painterUrl}/pdf`,
      encoding: null,
      json: true,
      body: {
        content: html
      }
    }, (err, response, data) => {
      if (err) {
        return next(err)
      }

      const disposition = format === 'pdf_inline' ? 'inline' : 'attachment'
      res.setHeader('Content-Disposition', `${disposition}; filename="print.pdf"`)
      res.send(data)
    })
  })
}
