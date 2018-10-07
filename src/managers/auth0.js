import { AuthenticationClient } from 'auth0'

import config from '../../config'

const client = new AuthenticationClient({
  domain: config.auth0.domain,
  clientID: config.auth0.clientId
})

const getUserInfo = accessToken =>
  new Promise((resolve, reject) => {
    client.getProfile(accessToken, (err, profile) => {
      if (err) {
        return reject(err)
      }
      profile.isAdmin = !!config.admin.users.match(profile.sub)
      profile.profileId = profile.profileId || profile.sub

      return resolve(profile)
    })
  })

module.exports = {
  getUserInfo
}
