const config = require('../../../config')
const mailer = require('../mailer')

module.exports = generator => {
  const status = generator.parent ? 'copiado' : 'nuevo'
  mailer({
    subject: `[ROLEANDO] generador ${status} "${generator.name}" (${process.env.NODE_ENV})`, // eslint-disable-line no-process-env
    text: formatText(generator)
  })
}

const formatText = generator => `
Nombre: "${generator.name}"

Link: ${config.host}${generator.link}

Decripcion: "${generator.desc}"

Autor: "${generator.author.name}"

`
