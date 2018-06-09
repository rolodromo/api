import auth0 from 'auth0-js'

import config from '../../config'

const client = new auth0.Authentication({
  domain: config.auth0.domain,
  clientID: config.auth0.clientId
})

const getUserInfo = accessToken =>
  new Promise((resolve, reject) => {
    client.userInfo(accessToken, (err, profile) => {
      if (err) {
        return reject(err)
      }

      return resolve(profile)
    })
  })

module.exports = {
  getUserInfo
}
