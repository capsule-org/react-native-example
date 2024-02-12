// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const nodeLibs = require("node-libs-expo");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...nodeLibs,
  stream: require.resolve("readable-stream"),
  crypto: require.resolve("react-native-crypto"),
  process: require.resolve("process"),
};

module.exports = config;
