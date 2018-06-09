import monk from 'monk'

import config from '../../config'

module.exports = monk(config.database.url)
