import mongoose from 'mongoose'
import logger from './logger'

const dbURI = "mongodb://localhost/wechat"

mongoose.connect(dbURI)

// When successfully connected
mongoose.connection.on('connected', function () {
  logger.verbose('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  logger.verbose('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    logger.verbose('Mongoose default connection disconnected through app termination');

    /*eslint no-process-exit: 0*/
    process.exit(0);
  });
});

require('./models/user')
