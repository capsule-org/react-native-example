const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const nodeLibs = require('node-libs-react-native');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      ...nodeLibs,
      crypto: require.resolve('react-native-crypto'),
      stream: require.resolve('readable-stream'),
      process: require.resolve('process'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
