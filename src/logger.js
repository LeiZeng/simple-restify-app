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

export const auditLogger = () => (req, res, route, err) => {
  var latency = res.get('Response-Time');

  if (typeof (latency) !== 'number') {
    latency = Date.now() - req._time;
  }

  var obj = {
    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort,
    req_id: req.getId(),
    latency: latency,
    secure: req.secure,
    path: req.path(),
    _audit: true
  };

  logger.info('Audit -- ', obj);

  if (err) {
   logger.error('Error -- %s', err, obj)
  }

  return (true);
}

export default logger
