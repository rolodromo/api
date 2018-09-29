const config = require('../../../config')

const MAP = {
  dice: 'dados',
  sound: 'sonidos',
  generator: 'generadores',
}
module.exports = (collection = {}) => {
  collection.link = `/colecciones/${MAP[collection.type]}/${collection.slug}/${collection.id}`
  collection.shortLink = `${config.host}/c/${collection.id}`
  return collection
}
