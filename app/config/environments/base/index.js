const baseConfig = require('./env.base');
const corsConfig = require('./env.cors');

const mergedEnvironmentConfig = {
	...baseConfig,
	...corsConfig,
};

Object.freeze(mergedEnvironmentConfig);
module.exports = mergedEnvironmentConfig;
