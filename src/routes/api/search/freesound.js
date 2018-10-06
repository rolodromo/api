const request = require('request')
const { defaultTo, clamp } = require('lodash')
const querystring = require('querystring')

const config = require('../../../../config')

const TAGS = 'id,name,duration,previews,url,tags'
const PAGE_SIZE = 100

module.exports = async (req, res, next) => {
  try {
    const { query, minDuration, maxDuration, sort, pageSize } = req.query

    const qs = {
      query,
      page_size: clamp(defaultTo(pageSize, 50), 10, PAGE_SIZE),
      token: config.search.freesoundApiKey,
      fields: TAGS
    }

    if (maxDuration) {
      qs.filter = `duration:[* TO ${maxDuration}]`
    }

    if (minDuration) {
      qs.filter = `duration:[${minDuration} TO *]`
    }

    if (minDuration && maxDuration) {
      qs.filter = `duration:[${minDuration} TO ${maxDuration}]`
    }
    if (sort) {
      qs.sort = sort
    }

    request({
      method: 'GET',
      url: `https://freesound.org/apiv2/search/text/?${querystring.stringify(qs)}`,
      json: true
    }).pipe(res)

  } catch (err) {
    return next(err)
  }
}
