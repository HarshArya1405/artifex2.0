// Global variable and config setup

/**
 * Import libraries, utils and packages
 */
const http = require('http');
const express = require('express');
const { getRoutes } = require('get-routes');
const { mergedEnvironmentConfig } = require('./config/env.config');
const { route } = require('./modules/dummy/routes/dummy.route');
import cors from 'cors';

/**
 * Express JS setup
 */
const app = express();

// Get port from environment and store in Express.
let port = mergedEnvironmentConfig.servicePort || '3000';
try {
  port = parseInt(port, 10);
  if (Number.isNaN(port)) {
    // named pipe
    port = mergedEnvironmentConfig.servicePort;
  }

  if (port >= 0) {
    // port number
    port = mergedEnvironmentConfig.servicePort;
  }
} catch (error) {
  port = mergedEnvironmentConfig.servicePort;
}

// Create HTTP server.
const server = http.createServer(app);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});

app.use((req, res, next) => {
	const host = req.get('host');
	const origin = req.get('origin');
	const baseUrlInRequest = `${req.protocol}://${req.get('host')}`;
	console.log(`[VIEW-STATS][REQUEST_INTERCEPTOR] baseUrlInRequest ${baseUrlInRequest} host ${host} origin ${origin}`)
	return next();
});


// Global exception handler for HTTP/HTTPS requests
app.use(function (err, req, res, next) {

	// Send response status based on custom error code
	if (err.status) {
			return res.status(err.status).json({error: err.message});
	}

	const { baseUrl, path, body, query, headers } = req
	const fullUrl = `${baseUrl}${path}`
	const debugInfo = {
			fullUrl, body, query, headers
	}

	const emailBody =`
		Team,\n\n
		Here are the details of the exception:\n\n
		Request fullUrl: ${debugInfo.fullUrl}\n\n
		Request body : ${JSON.stringify(debugInfo.body)}\n\n
		Request query: ${JSON.stringify(debugInfo.query)}\n\n
		Request headers: ${JSON.stringify(debugInfo.headers)}\n\n
		Error message: ${err?.message}\n\n
		Error stacktrace: ${err?.stack}\n`

	const emailSubject = err?.message ?? `Exception occurred at ${new Date()}`
	
	const bindingParams = {
			emailRecipients: mergedEnvironmentConfig.email.exceptionEmailRecipients,
			subject: `Env ${mergedEnvironmentConfig.appEnvironment} : ${emailSubject}`,
			text: emailBody
	}

	// Send an exception email to dev users
	sendNotificationEmail({templateName: 'EXCEPTION_EMAIL', bindingParams})

	// If no custom error is thrown then return 500(server side error/exception)
	if (res.headersSent) {
			logger.info(`[VIEW-STATS][GlobalExceptionHandler] Headers already set emailRecipients:`, {tagMetaData: req.headers})
			return next(err)
	}

	res.status(500).json({error: 'Something went wrong. Please try again'});
});

// Global exception handler for unhandled rejections
process.on('unhandledRejection', (reason, p) => {
	console.error('[VIEW-STATS] Unhandled Rejection at: Promise', p, 'reason:', reason);
	let promiseObjectDetails = util.inspect(p, { showHidden: false, depth: null })
	let reasonObjectDetails = util.inspect(reason, { showHidden: false, depth: null })

	const emailBody =`
		Team,\n\n
		Here are the details of the exception:\n\n
		Promise details: ${promiseObjectDetails}\n\n
		Error reason : ${reasonObjectDetails}`

	const emailSubject = err?.message ?? `Exception occurred at ${new Date()}`
	
	const bindingParams = {
			emailRecipients: mergedEnvironmentConfig.email.exceptionEmailRecipients,
			subject: `Env ${mergedEnvironmentConfig.appEnvironment} : ${emailSubject}`,
			text: emailBody
	}

	// Send an exception email to dev users
	sendNotificationEmail({templateName: 'EXCEPTION_EMAIL', bindingParams})
});

app.use(express.json({ limit: '50mb' }));
app.use(express.raw());
app.use(express.text());
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: false,
  })
);
app.disable('etag');

/**
 * Router initialization
 */
const routes = require('./init/router.init')();
console.log(mergedEnvironmentConfig.appNamespace)
app.use(`/api/${mergedEnvironmentConfig.appNamespace}/`, cors(corsOptionsDelegate) ,routes);

const routeDetails = getRoutes(app);

const whitelist = mergedEnvironmentConfig.cors.whitelistUrls;
const corsOptionsDelegate = function (req, callback) {
    let corsOptions = {credentials: true};
    corsOptions['origin'] = (whitelist.indexOf(req.header('Origin')) !== -1);
    corsOptions['exposedHeaders'] = 'set-cookie';
    callback(null, corsOptions) // callback expects two parameters: error and optionsns
};

  try {
    app.set('port', port);
    server.listen(port);
  } catch (expressStartupError) {
    logger.info(`[server.js] Express startup failed. expressStartupError: `, {tagMetaData: {expressStartupError}});
  }


module.exports = app;