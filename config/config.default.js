/* eslint valid-jsdoc: "off" */

'use strict'

const path = require('path')
const fsStore = require('cache-manager-fs-hash')
const redisStore = require('cache-manager-ioredis')
const sqlite3 = require('sqlite3').verbose()

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1599525172557_9843'

  config.security = {
    csrf: {
      enable: false,
    },
  }

  // add your middleware config here
  config.middleware = ['notfoundHandler']

  config.jwt = {
    secret: '0eMM1Y0p5L',
    ignore: ['/user/login'],
  }

  // add your user config here
  const userConfig = {
    redirect_uri: '',
    scope: 'offline_access user.read files.readwrite.all',
    rest_endpoint: 'https://graph.microsoft.com/',
    rest_endpoint_cn: 'https://microsoftgraph.chinacloudapi.cn/',
    com_api: {
      tokenHost: 'https://login.microsoftonline.com/common/',
      authorizePath: 'oauth2/v2.0/authorize',
      tokenPath: 'oauth2/v2.0/token',
    },
    cn_api: {
      tokenHost: 'https://login.partner.microsoftonline.cn/common/',
      authorizePath: 'oauth2/authorize',
      tokenPath: 'oauth2/token',
    },
  }

  const cache = {
    default: 'redis',
    stores: {
      memory: {
        driver: 'memory',
        max: 100,
        ttl: 0,
      },
      fs: {
        driver: fsStore,
        path: 'cache', // path for cached files
        ttl: 60 * 60, // time to life in seconds
        subdirs: false,
        zip: true, // zip files to save diskspace (default: false)
      },
      redis: {
        driver: redisStore,
        host: 'localhost', // default value
        port: 6379, // default value
        auth_pass: '',
        db: 0,
        ttl: 600,
        valid: (_) => _ !== null,
      },
    },
  }

  const view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  }

  const cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }

  const sequelize = {
    dialect: 'sqlite',
    dialectModule: sqlite3,
    storage: path.join(__dirname, '..', 'storage/olaindex.db'),
    logging: console.log,
    define: {
      underscored: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      paranoid: false,
    },
    // 是否同步
    sync: {force: false},
  }

  return {
    ...config,
    ...userConfig,
    cache,
    view,
    cors,
    sequelize,
  }
}
