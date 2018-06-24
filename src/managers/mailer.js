import nodemailer from 'nodemailer'
import transport from 'nodemailer-sendgrid-transport'
import { merge } from 'lodash'
import config from '../../config'

const DEFAULT_OPTIONS = {
  to: config.mailRecipient,
  from: config.mailRecipient
}
const sendgridConf = {
  auth: {
    api_user: config.sendgrid.user,
    api_key: config.sendgrid.pass
  }
}
const mailer = nodemailer.createTransport(transport(sendgridConf))

module.exports = inOpts => {
  const options = merge({}, DEFAULT_OPTIONS, inOpts)

  return mailer
    .sendMail(options)
    .catch(err => {
      console.log(err)
    })
}
