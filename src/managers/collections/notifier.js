const config = require('../../../config')
const mailer = require('../mailer')

module.exports = collection => {
  mailer({
    subject: `[ROLODROMO] coleccion "${collection.name}" (${process.env.NODE_ENV})`, // eslint-disable-line no-process-env
    text: formatText(collection)
  })
}

const formatText = collection => `
Nombre: "${collection.name}"

Link: ${config.host}${collection.link}

Decripcion: "${collection.desc}"

Autor: "${collection.author.name}"

`
