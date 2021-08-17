const fs = require('fs');
const chalk = require('chalk');
// const rimraf = require('rimraf');
const moduleName = process.argv[2];
const {
  Context,
  scaffold,
} = require('./utils')

const context = new Context(moduleName);
const filesToBuild = [
  'module',
  'service',
  'constants'
];

if (fs.existsSync(`./${context.camel}`)){
  console.error(chalk.red.bold(`Directory with name "${context.camel}" already exists. Aborting.`));
  process.exit(1);
} else {
  scaffold(context, filesToBuild);
}
