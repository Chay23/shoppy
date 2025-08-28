## Project setup

### Docker

```bash
$ docker compose build
```

### Local

```bash
$ npm install
```

Create a database (preferably PostgreSQL), provide DATABASE_URL variable inside .env

Generate Prisma Client

```bash
$ npx prisma generate
```

Apply migrations

```bash
$ npx prisma migrate deploy
```


## Compile and run the project

### Docker 

```bash
$ docker compose up
```

### Local

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
