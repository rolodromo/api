
const restore = require('mongodb-restore')

module.exports = (dbUri, dbName) => new Promise((resolve, reject) => {
  restore({
    uri: dbUri,
    root: `${__dirname}/../backup/${dbName}`,
    callback: function (err) {
      if (err) {
        return reject(err)
      }
      console.log('restore finished')
      return resolve()
    }
  })
})
