const Client = require('twit')

const config = require('../../../config')

const T = new Client(config.twitter)

const tweet = ({ status, inReplyTo, dryRun }) => new Promise((resolve, reject) => {
  if (dryRun) {
    console.log(`This would tweet: \n\t${status}`)
    return resolve(status)
  }

  console.log('Tweeting...')
  T.post('statuses/update', { status, in_reply_to_status_id: inReplyTo }, (err, data) => {
    if (err) {
      console.error('Error twitting:', err)
      return reject(err)
    }

    console.log(`Published tweet ${data.id_str}. done!`)
    console.log(data.text)
    return resolve(data.text)
  })
})

const deleteTweet = (id) => new Promise((resolve, reject) => {

  T.post('statuses/destroy/:id', { id }, (err, data, response) => {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  })
})

module.exports = {
  tweet,
  deleteTweet
}
