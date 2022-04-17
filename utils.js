const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const rimraf = require('rimraf');

const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');
const startCase = require('lodash.startcase');
const snakeCase = require('lodash.snakecase');

const infoLog = log => {
  console.log(chalk.blue(log));
};
const errorLog = log => {
  console.log(
    chalk.red.bold(log)
  );
};

const basePath = ({ isPackage, kebab }) => {
  const currentDir = process.cwd();
  if (isPackage) {
    console.log('isPackage: ', isPackage);
    mkdirp.sync(kebab);
    console.log('path.join curr kebab src-------->', path.join(currentDir, kebab, 'src'));
    return path.join(currentDir, kebab, 'src');
  } else {
    return path.join(currentDir, 'src', kebab);
  }
  // return isPackage ? `${currentDir}/src` : `${currentDir}/src/${kebab}`;
};
const prettyPrintDirectory = ({ isPackage, kebab }) => {
  return isPackage ? `${path.basename(path.resolve())}/src` : `${path.basename(path.resolve())}/src/${kebab}`;
};

function Context(modName, isPackage, isGlobal) {
  this.name = modName;
  this.capital = snakeCase(this.name).toUpperCase();
  this.kebab = kebabCase(this.name.toLowerCase());
  this.pascal = startCase(this.name).replace(/ /g, '');
  this.camel = camelCase(this.name)
  this.moduleName = `${this.pascal}Module`;
  this.serviceName = `${this.pascal}Service`;
  this.isPackage = isPackage;
  this.isGlobal = isGlobal;
  this.dirPrefix = isPackage ? `${this.kebab}/` : '';
}

const buildTemplate = (type, context, prefix=true) => {
  const template = fs.readFileSync(path.join(__dirname, 'templates', `${type}.hbs`), { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = prefix ? `${context.kebab}.${type}.ts` : `${type}.ts`;
  const fullPath = path.join(basePath(context), fileName);
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ${prettyPrintDirectory(context)}/${fileName}`);
};

const buildInterfaceTemplates = (context) => {
  // interfaces
  let template = fs.readFileSync(path.join(__dirname, 'templates', 'interfaces.hbs'), { encoding: 'utf-8' });
  let compiled = Handlebars.compile(template);
  let output = compiled(context);
  let fileName = `${context.kebab}-module.interfaces.ts`;
  let fullPath = path.join(basePath(context), 'interfaces', fileName);
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ${prettyPrintDirectory(context)}/interfaces/${fileName}`);
  // barrel file
  template = fs.readFileSync(path.join(__dirname, 'templates', 'interfacesIndex.hbs'), { encoding: 'utf-8' });
  compiled = Handlebars.compile(template);
  output = compiled(context);
  fileName = 'index.ts';
  fullPath = path.join(basePath(context), 'interfaces', fileName);
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ${prettyPrintDirectory(context)}/interfaces/${fileName}`);
};

const buildTestTemplates = (context) => {
  // interfaces
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'spec.hbs'), { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = `${context.kebab}.spec.ts`;
  const fullPath = path.join(basePath(context), '__tests__', fileName);
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ${prettyPrintDirectory(context)}/__tests__/${fileName}`);
};

const copyPackageFiles = (context) => {
  const currentDir = process.cwd();
  const packageDir = path.join(__dirname, 'templates', 'package-files');
  const files = fs.readdirSync(packageDir);
  for (let file of files) {
    let template = fs.readFileSync(path.join(__dirname, 'templates', 'package-files', file), { encoding: 'utf-8' });
    let compiled = Handlebars.compile(template);
    let output = compiled(context);
    let fileName = file.slice(0, -4);
    let fullPath = path.join(currentDir, context.kebab, fileName);
    fs.writeFileSync(fullPath, output);
    infoLog(`Created file: ${path.basename(path.resolve())}/${fileName}`);
  }
  buildTemplate('index', context, false);
};

const scaffold = (context, filesToBuild) => {
  try {
    mkdirp.sync(`${basePath(context)}`);
    mkdirp.sync(`${basePath(context)}/interfaces`);
    mkdirp.sync(`${basePath(context)}/__tests__`);
    if (context.isPackage) {
      copyPackageFiles(context);
    }
    for (let type of filesToBuild) {
      buildTemplate(type, context);
    }
    buildInterfaceTemplates(context);
    buildTestTemplates(context);
    console.log(
      chalk.bold.greenBright(
        `Success. Created package at ${prettyPrintDirectory(context)}`
      ));
  } catch (err) {
    context.isPackage
    ? rimraf.sync(`${process.cwd()}/{*,.*}`)
    : rimraf.sync(`${basePath(context)}`);
    errorLog(`Error scaffolding module: ${err}`);
  }
}

module.exports = {
  Context,
  buildTemplate,
  buildInterfaceTemplates,
  scaffold
}
