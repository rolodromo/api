const rp = require('request-promise')
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

const tweetStorycubes = async () => {

  const img = await rp.get({
    uri: 'https://painter.rolodromo.com/storycubes',
    encoding: 'base64'
  })

  T.post('media/upload', { media_data: img }, function(err, data) {
    if (err) {
      return Promise.reject(err)
    }

    T.post('statuses/update', {
      status: 'Tuitea tu historia con estos #StoryCubes',
      media_ids: [data.media_id_string]
    }, function(err, { text, id }) {
      if (err) {
        return Promise.reject(err)
      }

      console.log('done', {
        twit: text,
        url: `https://twitter.com/roleandobot/status/${id}`
      })
    })
  })
}

module.exports = {
  tweet,
  tweetStorycubes,
  deleteTweet
}
