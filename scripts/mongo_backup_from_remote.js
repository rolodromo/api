
const backup = require('mongodb-backup')

module.exports = dbUri => new Promise((resolve, reject) => {
  backup({
    uri: dbUri,
    root: `${__dirname}/../backup/`,
    callback: function (err) {
      if (err) {
        return reject(err)
      }
      console.log('backup finished')
      return resolve()
    }
  })
})
