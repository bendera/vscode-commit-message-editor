const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      frameworks: ['mocha', 'chai'],
      client: {
        mocha: {ui: 'tdd'},
      },
      files: [
        {
          pattern: config.grep ? config.grep : 'dist/test/**/*.test.js',
          type: 'module',
        },
      ],
      // See the karma-esm docs for all options
      esm: {
        nodeResolve: true,
      },
      customContextFile: 'context.html'
    })
  );
  return config;
};