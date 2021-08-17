const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const rimraf = require('rimraf');

const kebabCase = require('lodash.kebabcase');
const capitalize = require('lodash.capitalize');
const camelCase = require('lodash.camelcase');
const startCase = require('lodash.startcase');
const snakeCase = require('lodash.snakecase');

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
  const template = fs.readFileSync(path.join(__dirname, 'templates', `${type}.hbs`), { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = `${context.kebab}.${type}.ts`;
  fs.writeFileSync(`${currentDir}/${context.camel}/${fileName}`, output);
  console.log(chalk.blue(`Created file: ${fileName}`));
};

const buildInterfaceTemplates = (context) => {
  const currentDir = process.cwd();
  // interfaces
  let template = fs.readFileSync(path.join(__dirname, 'templates', 'interfaces.hbs'), { encoding: 'utf-8' });
  let compiled = Handlebars.compile(template);
  let output = compiled(context);
  let fileName = `${context.kebab}-module.interfaces.ts`;
  fs.writeFileSync(`${currentDir}/${context.camel}/interfaces/${fileName}`, output);
  // barrel file
  template = fs.readFileSync(path.join(__dirname, 'templates', 'interfacesIndex.hbs'), { encoding: 'utf-8' });
  compiled = Handlebars.compile(template);
  output = compiled(context);
  fileName = 'index.ts';
  fs.writeFileSync(`${currentDir}/${context.camel}/interfaces/${fileName}`, output);
  console.log(chalk.blue(`Created file: ${fileName}`));
};

const scaffold = (context, filesToBuild) => {
  const currentDir = process.cwd();
  try {
    fs.mkdirSync(`${currentDir}/${context.camel}`);
    fs.mkdirSync(`${currentDir}/${context.camel}/interfaces`);
    for (let type of filesToBuild) {
      buildTemplate(type, context);
      buildInterfaceTemplates(context);
    }
    console.log(
      chalk.bold.greenBright(
        `Success. Created package at ${currentDir}/${context.camel}`
      ));
  } catch (err) {
    rimraf.sync(`${currentDir}/${context.camel}`);
    console.log(
      chalk.red.bold(`Error scaffolding module: ${err}`)
    );
  }
}

module.exports = {
  Context,
  buildTemplate,
  buildInterfaceTemplates,
  scaffold
}
