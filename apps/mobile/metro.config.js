// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config')
const { FileStore } = require('metro-cache')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// #1 - Watch all files in the monorepo
config.watchFolders = [projectRoot, workspaceRoot]
// #3 - Force resolving nested modules to the folders below
config.resolver.disableHierarchicalLookup = true
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(workspaceRoot, 'node_modules'),
]
config.projectRoot = workspaceRoot
config.resolver.resolverMainFields = config.resolver.resolverMainFields.concat([
	'exports',
])

console.log(config)

module.exports = config
