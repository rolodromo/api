import { get, pick } from 'lodash'
import config from '../../config'

const db = require('./db')
const auth0 = require('./auth0')
const tokenManager = require('./token')

const PUBLIC_PROFILE_KEYS = 'name email picture'.split(' ')

const users = db.get('users')

const auth0login = accessToken => {
  return auth0
    .getUserInfo(accessToken)
    .then(updateProfile)
}

const updateProfile = profile => {
  return users
    .findOneAndUpdate({
      profileId: profile.profileId || profile.user_id
    }, {
      $set: {
        profile,
        updatedAt: new Date()
      }
    }, { upsert: true })
}

const generateTokens = user => {
  if (!user) throw new Error('Missing user info')

  const publicProfile = pick(user.profile, PUBLIC_PROFILE_KEYS)
  publicProfile.id = user.profileId
  publicProfile.isAdmin = user.profile.isAdmin
  const response = tokenManager.createTokens(user.profileId, publicProfile)
  response.profile = publicProfile
  return response
}

const findByProfileId = profileId => {
  return users.findOne({ profileId })
}

const isAdmin = user => {
  return !!config.admin.users.match(user.profileId)
}

module.exports = {
  isAdmin,
  auth0login,
  findByProfileId,
  generateTokens
}
