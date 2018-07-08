import sm  from 'sitemap'
import express from 'express'
const router = express.Router()

const sitemap = sm.createSitemap({
  hostname: 'https://rolodromo.com',
  cacheTime: 86400000, // 86400 sec - cache purge period
  urls: [
    { url: '/rolodromo/', changefreq: 'weekly', priority: 0.5 },
    { url: '/generadores/', changefreq: 'weekly', priority: 0.7 },
    { url: '/generadores/destacados', changefreq: 'weekly', priority: 0.8 },
    { url: '/', changefreq: 'monthly', priority: 0.2 }
  ]
})

router.get('/sitemap.xml', (req, res, next) => {
  sitemap.toXML(function(err, xml) {
    if (err) {
      return next(err)
    }
    res.header('Content-Type', 'application/xml')
    res.send(xml)
  })
})

module.exports = router
