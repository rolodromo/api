const config = require('../../../config')

module.exports = (collection = {}) => {
  collection.link = `/colecciones/${collection.slug}/${collection.id}`
  collection.shortLink = `${config.host}/c/${collection.id}`
  return collection
}
