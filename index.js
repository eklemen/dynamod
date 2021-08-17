const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const kebabCase = require('lodash.kebabcase');
const capitalize = require('lodash.capitalize');
const camelcase = require('lodash.camelcase');
const currentDir = process.cwd();
const Handlebars = require('handlebars');
const moduleName = process.argv[2];

function Context(modName) {
  this.name = modName;
  this.capital = this.name.toUpperCase();
  this.kebab = kebabCase(this.name.toLowerCase());
  this.pascal = capitalize(this.name);
  this.camel = camelcase(this.name)
  this.moduleName = `${this.pascal}Module`;
  this.serviceName = `${this.pascal}Service`;
}

const context = new Context(moduleName);

const buildTemplate = (type) => {
  const template = fs.readFileSync(`templates/${type}.hbs`, { encoding: 'utf-8' });
  const compiled = Handlebars.compile(template);
  const output = compiled(context);
  const fileName = `${context.kebab}.${type}.ts`;
  fs.writeFileSync(`${currentDir}/${context.camel}/${fileName}`, output);
  console.log(chalk.blue(`Created file: ${fileName}`));
};
const filesToBuild = [
  'module',
  'service',
  'constants'
];

const buildInterfaceTemplates = () => {
  // interfaces
  let template = fs.readFileSync(`templates/interfaces.hbs`, { encoding: 'utf-8' });
  let compiled = Handlebars.compile(template);
  let output = compiled(context);
  let fileName = `${context.kebab}-module.interfaces.ts`;
  fs.writeFileSync(`${currentDir}/${context.camel}/interfaces/${fileName}`, output);
  // barrel file
  template = fs.readFileSync(`templates/interfacesIndex.hbs`, { encoding: 'utf-8' });
  compiled = Handlebars.compile(template);
  output = compiled(context);
  fileName = 'index.ts';
  fs.writeFileSync(`${currentDir}/${context.camel}/interfaces/${fileName}`, output);
  console.log(chalk.blue(`Created file: ${fileName}`));
};

function scaffold() {
  try {
    fs.mkdirSync(`./${context.camel}`);
    fs.mkdirSync(`./${context.camel}/interfaces`);
    for (let type of filesToBuild) {
      buildTemplate(type);
      buildInterfaceTemplates();
    }
    console.log(
      chalk.bold.greenBright(
        `Success. Created package at ${currentDir}/${context.camel}`
      ));
  } catch (err) {
    // rimraf(`${currentDir}/${context.camel}`);
    console.log(
      chalk.red.bold(`Error scaffolding module: ${err}`)
    );
  }
}

if (fs.existsSync(`./${context.camel}`)){
  console.error(chalk.red.bold(`Directory with name "${context.camel}" already exists. Aborting.`));
  process.exit(1);
} else {
  scaffold();
}
