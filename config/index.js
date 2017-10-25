// require dependencies

const path     = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env      = process.env.NODE_ENV || 'development';

const config = {
  development: {
    name: 'development',
    root: rootPath,
    app: {
      name: 'gulp-framework-development'
    },
    port: process.env.PORT || 3000
  },

  integration: {
    name: 'integration',
    root: rootPath,
    app: {
      name: 'gulp-framework-integration'
    },
    port: process.env.PORT || 3000
  },

  production: {
    name: 'production',
    root: rootPath,
    app: {
      name: 'gulp-framework-production'
    },
    port: process.env.PORT || 3000
  }
};

module.exports = config[env];
