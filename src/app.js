const express = require('express');
const engines = require('consolidate');
const cluster = require('cluster');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const routes = require('./routes');
const { Logger } = require('./middleware');
const { port } = config.get('app');

const app = express();
let workers = [];

/**
 * Setup number of worker processes to share port which will be defined while setting up server
 */
const setupWorkerProcesses = () => {
  // to read number of cores on system
  let numCores = require('os').cpus().length;
  console.log('Master cluster setting up ' + numCores + ' workers');

  // iterate on number of cores need to be utilized by an application
  // current example will utilize all of them
  for (let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[i].on('message', function (message) {
      console.log(message);
    });
  }

  // process is clustered on a core and process id is assigned
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is listening');
  });

  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length - 1].on('message', function (message) {
      console.log(message);
    });
  });
};

/**
 * Setup an express server and define port to listen all incoming requests for this application
 */
const setUpExpress = () => {
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '10mb',
      extended: true,
      parameterLimit: 50000,
    })
  );

  // Enable cors support to accept cross origin requests
  // app.use(cors({ origin: [process.env.CORS_URL,'http://admin.eyewear.com','https://admin.eyewear.com','http://hto.eyewear.com','https://hto.eyewear.com'], optionsSuccessStatus: 200 }));
  app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

  // Enable helmet js middlewares to configure secure headers
  app.use(helmet());

  // Enable gzip compression module for REST API
  app.use(compression());

  // Disble x-powered-by header to hide server side technology
  app.disable('x-powered-by');

  app.use(Logger);

  // REST API entry point
  app.use('/api', routes());


  app.engine('ejs', engines.ejs);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');


  app.use('/*', (req, res, next) => {
    res.json({ status: 'Application runing successfully!' });
  });
  // 404 Error Handling
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Express application port config
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });

};


/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */
const setupServer = (isClusterRequired) => {

  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    setUpExpress();
  }
};

setupServer(false);

module.exports = app;
