# dynamod

Generate boilerplate for [NestJS dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-modules).

### Usage
```shell
npx dynamod <module name>

## example
npx dynamod banana
```
**NOTE: this will place the directory within `./src`**

#### Output
```shell
banana
├── banana.constants.ts
├── banana.module.ts
├── banana.service.ts
└── interfaces
    ├── banana-module.interfaces.ts
    └── index.ts
```

### Options

| Config | Flag | Output |                                                                                                       
|--------|------|--------|
| Scaffold as standalone package| --package -p | Generate the module to be a standalone package (to publish to npm for example). Generates extra files: package.json, readme, and dotfiles. |
| Global Module | --global -g  | Passes `{global: true}` to module creation methods to scaffold a [**global module**](https://docs.nestjs.com/modules#global-modules).                                               |

Example
```shell
mkdir examplemod
cd examplemod

npx dynamod examplemod --project
# or
npx dynamod examplemod -p
```

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
