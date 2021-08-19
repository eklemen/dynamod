#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const moduleName = process.argv[2];
const isPackage = process.argv.includes('--package') || process.argv.includes('-p');
const isGlobal = process.argv.includes('--global') || process.argv.includes('-g');
if (!moduleName) {
  console.error(chalk.red.bold('Must supply a name for this module. Ex: $ dynamod my-module'));
  process.exit(1);
}
const {
  Context,
  scaffold,
} = require('./utils')

const context = new Context(moduleName, isPackage, isGlobal);
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
