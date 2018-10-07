import rpgen from '@rolodromo/rpgen'
import striptags from 'striptags'

const config = require('../../../config')

const MAX_RETRIES = config.twitter.maxRetries

const isTwittable = str => str.length <= config.twitter.tweetLength

const generateFormatted = ({ generator, stripHeader, stripTags=true }) => {
  let cleanText = generator.generate()

  if (stripHeader) cleanText = cleanText.replace(/^.+<hr>/, '')

  if (stripTags) {
    cleanText = striptags(cleanText, ['strong', 'span'], '\n').replace(/\n+/g, '\n').replace(/ +/g, ' ')
    cleanText = striptags(cleanText, [], '')
  }

  return cleanText.replace(/^\n*\s*/g, '').replace(/\n*\s*$/g, '')
}

const generateTwittable = ({ generator, extra, stripHeader }) => {
  let cleanText
  let times = 0

  do {
    times++
    cleanText = generateFormatted({ generator, stripHeader })
  } while (!isTwittable(`${cleanText}\n${extra}`) && times < MAX_RETRIES)

  if (times === MAX_RETRIES) {
    throw new Error(`Generator made too long texts after ${MAX_RETRIES} retries`)
  }

  if (times > 1) {
    console.log(`Got one after ${times} times`)
  }

  return cleanText
}



const makeGenerator = (generator) => {
  generator.children =  generator.children || {}
  const { tpls, tables } = generator.data
  const childrenNames = Object.keys(generator.children)
  let children = ''
  if (childrenNames.length) {
    children = childrenNames.reduce((str, key) => {
      const data = generator.children[key]
      return `${str}\n\n${data.tables}`
    }, '')
  }
  return rpgen.generator.create(`${tpls}\n\n${tables}\n\n${children}`)
}

module.exports = {
  generateTwittable,
  generateFormatted,
  makeGenerator
}
