const fs = require('fs');
const rimraf = require('rimraf');

const {
  Context,
  buildTemplate,
  buildInterfaceTemplates,
  scaffold
} = require('./utils');

describe('Utils', () => {
  describe('Context constructor', () => {
    let context;
    test('should format all lowercase one word', () => {
      context = new Context('lowercase');
      expect(context).toEqual({
        camel: 'lowercase',
        capital: 'LOWERCASE',
        kebab: 'lowercase',
        moduleName: 'LowercaseModule',
        name: 'lowercase',
        pascal: 'Lowercase',
        serviceName: 'LowercaseService'
      })
    });
    test('should format all lowercase two words', () => {
      context = new Context('lower-two');
      expect(context).toEqual({
        camel: 'lowerTwo',
        capital: 'LOWER_TWO',
        kebab: 'lower-two',
        moduleName: 'LowerTwoModule',
        name: 'lower-two',
        pascal: 'LowerTwo',
        serviceName: 'LowerTwoService'
      })
    });
    test('should format all mixed case one word', () => {
      context = new Context('Test');
      expect(context).toEqual({
        camel: 'test',
        capital: 'TEST',
        kebab: 'test',
        moduleName: 'TestModule',
        name: 'Test',
        pascal: 'Test',
        serviceName: 'TestService'
      })
    });
  });

  describe('buildTemplate and buildInterfaceTemplates', () => {
    let context;
    beforeEach(() => {
      jest.spyOn(fs, 'writeFileSync').mockReturnValue(null);
      jest.spyOn(fs, 'readFileSync');
      jest.spyOn(process, 'cwd').mockReturnValue('cwd');
      context = {
        camel: 'test',
        capital: 'TEST',
        kebab: 'test',
        moduleName: 'TestModule',
        name: 'test',
        pascal: 'Test',
        serviceName: 'TestService'
      }
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('build template should writeFileSync', () => {
      buildTemplate('module', context)
      expect(fs.readFileSync).toHaveBeenCalledWith('templates/module.hbs', {encoding: 'utf-8'});
      expect(fs.writeFileSync.mock.calls[0][0]).toEqual('cwd/test/test.module.ts');
    });

    test('buildInterfaceTemplate should writeFileSync twice', () => {
      buildInterfaceTemplates(context)
      expect(fs.readFileSync).toHaveBeenCalledWith('templates/interfaces.hbs', {encoding: 'utf-8'});
      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync.mock.calls[0][0]).toEqual('cwd/test/interfaces/test-module.interfaces.ts');
      expect(fs.writeFileSync.mock.calls[1][0]).toEqual('cwd/test/interfaces/index.ts');
    });
  });
  describe('scaffold', () => {
    let context;
    beforeEach(() => {
      jest.spyOn(fs, 'writeFileSync').mockReturnValue(null);
      jest.spyOn(fs, 'readFileSync');
      jest.spyOn(fs, 'mkdirSync').mockReturnValue(null);
      jest.spyOn(rimraf, 'sync').mockReturnValue(null);
      jest.spyOn(process, 'cwd').mockReturnValue('cwd');
      context = {
        camel: 'test',
        capital: 'TEST',
        kebab: 'test',
        moduleName: 'TestModule',
        name: 'test',
        pascal: 'Test',
        serviceName: 'TestService'
      }
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('create directories for package name and interfaces', () => {
      scaffold(context, ['module']);
      expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
      expect(fs.mkdirSync).toHaveBeenCalledWith('cwd/test');
      expect(fs.mkdirSync).toHaveBeenCalledWith('cwd/test/interfaces');
    });
    test('create directories for package name and interfaces', () => {

      scaffold(context, ['module']);
      expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
      expect(fs.mkdirSync).toHaveBeenCalledWith('cwd/test');
      expect(fs.mkdirSync).toHaveBeenCalledWith('cwd/test/interfaces');
    });
  });
});
