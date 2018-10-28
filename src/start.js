/* eslint-disable  no-console */

import express from 'express'
import errors from 'restify-errors'
import bodyParser from 'body-parser'

import routes from './routes'
import config from '../config'

export const app = express({
  name: config.name
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.use((err, req, res, next) => {
  console.error(err.message, err.stack)
  res.status(500).send(new errors.InternalServerError(err.message))
})

app.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`)
})
