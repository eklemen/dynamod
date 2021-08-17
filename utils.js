const fs = require('fs');
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

function Context(modName) {
  this.name = modName;
  this.capital = snakeCase(this.name).toUpperCase();
  this.kebab = kebabCase(this.name.toLowerCase());
  this.pascal = startCase(this.name).replace(/ /g, '');
  this.camel = camelCase(this.name)
  this.moduleName = `${this.pascal}Module`;
  this.serviceName = `${this.pascal}Service`;
}

const buildTemplate = (type, context) => {
  const currentDir = process.cwd();
  const src = `${currentDir}/src`;
  const template = fs.readFileSync(path.join(__dirname, 'templates', `${type}.hbs`), { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = `${context.kebab}.${type}.ts`;
  const fullPath = `${src}/${context.kebab}/${fileName}`;
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ./${context.kebab}/${fileName}`);
};

const buildInterfaceTemplates = (context) => {
  const currentDir = process.cwd();
  const src = `${currentDir}/src`;
  // interfaces
  let template = fs.readFileSync(path.join(__dirname, 'templates', 'interfaces.hbs'), { encoding: 'utf-8' });
  let compiled = Handlebars.compile(template);
  let output = compiled(context);
  let fileName = `${context.kebab}-module.interfaces.ts`;
  let fullPath = `${src}/${context.kebab}/interfaces/${fileName}`;
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ./${context.kebab}/interfaces/${fileName}`);
  // barrel file
  template = fs.readFileSync(path.join(__dirname, 'templates', 'interfacesIndex.hbs'), { encoding: 'utf-8' });
  compiled = Handlebars.compile(template);
  output = compiled(context);
  fileName = 'index.ts';
  fullPath = `${src}/${context.kebab}/interfaces/${fileName}`
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ./${context.kebab}/interfaces/${fileName}`);
};

const buildTestTemplates = (context) => {
  const currentDir = process.cwd();
  const src = `${currentDir}/src`;
  // interfaces
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'spec.hbs'), { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = `${context.kebab}.spec.ts`;
  const fullPath = `${src}/${context.kebab}/__tests__/${fileName}`;
  fs.writeFileSync(fullPath, output);
  infoLog(`Created file: ./__tests__/${fileName}`);
};

const scaffold = (context, filesToBuild) => {
  const currentDir = process.cwd();
  const src = `${currentDir}/src`;
  try {
    fs.mkdirSync(`${src}/${context.kebab}`);
    fs.mkdirSync(`${src}/${context.kebab}/interfaces`);
    fs.mkdirSync(`${src}/${context.kebab}/__tests__`);
    for (let type of filesToBuild) {
      buildTemplate(type, context);
    }
    buildInterfaceTemplates(context);
    buildTestTemplates(context);
    console.log(
      chalk.bold.greenBright(
        `Success. Created package at ${currentDir}/${context.kebab}`
      ));
  } catch (err) {
    rimraf.sync(`${currentDir}/${context.kebab}`);
    errorLog(`Error scaffolding module: ${err}`);
  }
}

module.exports = {
  Context,
  buildTemplate,
  buildInterfaceTemplates,
  scaffold
}
