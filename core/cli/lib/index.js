'use strict'

module.exports = core

// require: .js/.json/.node
// .js -> module.exports / exports
// .json / JSON.parse
const semver = require('semver')
const path = require('path')
const log = require('@jschen-cli/log')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync

const constant = require('./const')
const pkg = require('../package.json')

let args, config

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    checkGlobalUpdate()
    log.verbose('debug', 'test debug log')
  } catch (e) {
    log.error(e.message)
  }
}

function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function checkGlobalUpdate() {

}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgs() {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  checkArgs()
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error('当前登录用户主目录不存在')
  }
}

function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
}

function checkNodeVersion() {
  // console.log(process.version)
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`jschen-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

function checkPkgVersion() {
  log.info('cli', pkg.version)
}

checkUserHome()