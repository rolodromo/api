const config = require('../../../config')

module.exports = (generator = {}) => {
  generator.link = `/generadores/${generator.slug}/${generator.id}`
  generator.shortLink = `${config.host}/rg/${generator.id}`
  return generator
}
