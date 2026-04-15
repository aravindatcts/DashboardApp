const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const mobileDir = __dirname;
const sharedDir = path.resolve(__dirname, '../shared');

const config = getDefaultConfig(__dirname);

// Make Metro watch and bundle files from the shared/ folder
config.watchFolders = [...(config.watchFolders || []), sharedDir];

// Custom resolver: intercept @shared/* and rewrite to the absolute shared path.
// Also ensure that when files inside shared/ resolve their own imports (e.g. 'react'),
// they look up from the mobile/ node_modules, not from shared/ itself.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Rewrite @shared/x/y → <sharedDir>/x/y.js
    if (moduleName.startsWith('@shared/')) {
        const subPath = moduleName.replace('@shared/', '');
        const absolutePath = path.join(sharedDir, subPath);
        return {
            filePath: absolutePath + '.js',
            type: 'sourceFile',
        };
    }

    // When resolving from inside the shared directory, redirect to mobile's node_modules
    if (context.originModulePath && context.originModulePath.startsWith(sharedDir)) {
        try {
            const resolved = require.resolve(moduleName, {
                paths: [path.join(mobileDir, 'node_modules')],
            });
            return { filePath: resolved, type: 'sourceFile' };
        } catch (_) {
            // fall through
        }
    }

    // Default resolution
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
