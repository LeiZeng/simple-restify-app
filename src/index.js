import restify from 'restify'
import sessions from 'client-sessions'
import config from 'config'

import logger from './logger'
import './database'
import passport from './passport'
import * as user from './apis/user'

const server = restify.createServer()
const port = config.get('port')

server.pre(restify.pre.userAgentConnection())
server.use(restify.bodyParser())
server.use(restify.queryParser())

if (process.env.NODE_ENV === 'development') {
  require('./swagger').default(server)
}

server.use(sessions({
    // cookie name dictates the key name added to the request object
    cookieName: 'session-wechat-app-server',
    // should be a large unguessable string
    secret: 'blablalala',
    // how long the session will stay valid in ms
    duration: 365 * 24 * 60 * 60 * 1000
}))

passport(server)

restify.defaultResponseHeaders = function() {
  this.header('Access-Control-Allow-Origin', '*')
}

server.post('/login', user.login)
server.post('/register', user.register)
server.get('/profile/:id', user.profile)


logger.info(`running at ${process.env.NODE_ENV} mode.`)

server.listen(port)

logger.info(`server start at ${port}`)
