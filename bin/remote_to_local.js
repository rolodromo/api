/* eslint-disable no-process-env */

require('dotenv').config()

const REMOTEDB_URL = process.env.REMOTEDB_URL
const LOCALDB_URL = process.env.LOCALDB_URL
const backup = require('../scripts/mongo_backup_from_remote')
const restore = require('../scripts/mongo_restore_to_local')
const DB_NAME = process.env.REMOTEDB_NAME

backup(REMOTEDB_URL)
  .then(() => restore(LOCALDB_URL, DB_NAME))
  .catch(err => {
    console.error('ERROR!', err)
  })
