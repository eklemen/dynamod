# dynamod

Generate boilerplate for [NestJS dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-modules).

### Usage
```shell
npx dynamod <module name>

## example
npx dynamod banana
```

### Output
```shell
├── banana.constants.ts
├── banana.module.ts
├── banana.service.ts
└── interfaces
    ├── banana-module.interfaces.ts
    └── index.ts
```

This sets you up with `register` and `registerAsync` methods in your module.

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


