# dynamod

Generate boilerplate for [NestJS dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-modules) similar to how the native NestJS cli lets you create simple modules/services.

## Usage
There are two main usages for this generator.

[1. Generate a module within an existing project.](#usage-within-an-existing-nestjs-project)

[2. Generate a standalone package that you can build and publish to npm or use within your monorepo.](#usage-as-package)


### Usage within an existing NestJS project
```shell
# within /my-cool-project
npx dynamod <module name>

## example
npx dynamod banana
```
**NOTE: this will place the directory within `./src`**

#### Output
```shell
./src
├──banana
   ├── banana.constants.ts
   ├── banana.module.ts
   ├── banana.service.ts
   └── interfaces
       ├── banana-module.interfaces.ts
       └── index.ts
```

### Usage as package
_Note: You must first make the directory that your standalone package will live. Auto generating this directory is a future improvement._
```shell
mkdir examplemod
cd examplemod

npx dynamod examplemod --package
# or
npx dynamod examplemod -p
```

#### Output
```shell
./
├── README.md
├── nest-cli.json
├── package.json
├── src
│   ├── __tests__
│   │   └── examplemod.spec.ts
│   ├── examplemod.constants.ts
│   ├── examplemod.module.ts
│   ├── examplemod.service.ts
│   ├── index.ts
│   └── interfaces
│       ├── examplemod-module.interfaces.ts
│       └── index.ts
├── tsconfig.build.json
└── tsconfig.json
```

### Options

| Config | Flag | Output |                                                                                                       
|--------|------|--------|
| Scaffold as standalone package| --package <br/> -p | Generate the module to be a standalone package (to publish to npm for example). Generates extra files: package.json, readme, and dotfiles. |
| Global Module | --global <br/> -g  | Passes `{global: true}` to module creation methods to scaffold a [**global module**](https://docs.nestjs.com/modules#global-modules). This can be changed later or added to your module's configs at any time.|

Final product either way sets you up with `register` and `registerAsync` methods in your module.

### Use within your app
```typescript
@Module({
  // ...
  imports: [
    ConfigModule.forRoot(),
    BananaModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        someValue: configService.get<string>('SOME_VALUE'),
        anotherValue: 'static config',
      }),
      inject: [ConfigService],
    }),
  ],
  // ...
})
```

Most of the boilerplate code is in the `*.module.ts` file. The main part you will need to modify is the options and options interface that get passed into `.register()` and `.registerAsync()`.

You should not need to modify `createAsyncProviders()` or `.createAsyncProviders()` as they are private internally used methods to build the dynamic module.

