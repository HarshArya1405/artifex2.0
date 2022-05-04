import { Router } from 'express';
const glob = require('glob');

module.exports = () => glob
		.sync('**/*.route.js', {
			cwd: `${global.__basedir}/modules/`,
		})
		.map((filename) => {
			// console.log(`Attempting to register router at: path ../modules/${filename} from relative path ${__dirname}`);
			return require(`../modules/${filename}`);
		})
		.filter((currentRouter) => {
			const isCurrentRouterValid = Object.getPrototypeOf(currentRouter) === Router;
			return isCurrentRouterValid;
		})
		.reduce(
			(rootRouter, router) => rootRouter.use(router),
			Router({
				mergeParams: true,
			})
		);
