/**
 * @param {Array.<string>} workspacePath 
 * @returns {string}
 */
function resolveTsConfig(workspacePath) {
	const { resolve, join } = require("node:path");
	const wsPath = join(...workspacePath)
	const cwd = resolve(process.cwd())
	if (!cwd.includes(wsPath)) {
		return resolve(cwd, wsPath, 'tsconfig.json')	
	}

	return resolve(cwd, "tsconfig.json");
}

module.exports = {
	resolveTsConfig
}
