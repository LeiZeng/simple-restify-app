import winston from 'winston'

import config from 'config'

const logsPath = config.get('logsPath')
const loggerTransporters = [
  new (winston.transports.File)({
    name: 'info-file',
    filename: logsPath + '/log-info.log',
    level: 'info'
  }),
  new (winston.transports.File)({
    name: 'error-file',
    filename: logsPath + '/log-error.log',
    level: 'error'
  })
]

if (process.env.NODE_ENV !== 'production') {
  loggerTransporters.push(new (winston.transports.File)({
    name: 'debug-file',
    filename: logsPath + '/log-debug.log',
    level: 'debug'
  }))
}

const logger = new (winston.Logger)({ transports: loggerTransporters });

export default logger
