After cloning this repo, make sure you have `duplicated` the `.env.example` file to `.env`, don't let the .env.example file be deleted or renamed.

### Install

```sh
yarn
```

### Install GLOBAL SEQUELIZE-CLI

```sh
[Sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
```

### Enabled Husky

```sh
npx husky install
```

or

```sh
yarn husky install
```

### Generate Secret Key

```sh
yarn key:generate
```

### Usage Development

```sh
yarn dev
```

### Lint Check

```sh
yarn test:lint
```

### Type Check

```sh
yarn test:types
```

### Type Check Watch mode

```sh
yarn test:types-watch
```

### Build

by default build codebase with `SWC`, if you want to build with TypeScript, run this command : `yarn build:ts`

```sh
yarn build
```

## Using Sequelize

Using sequelize with development mode, you can set the database configuration in `.env`, like this :

```sh
DB_CONNECTION=postgresql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=example_database
DB_USERNAME=example_user
DB_PASSWORD=example_password
DB_SYNC=
DB_TIMEZONE=+07:00
```

then after that you can adjust the database config in `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
now you can run this command :

```sh
yarn db:reset
```

### Usage Production

```sh
yarn serve:production
```

### Run tests

```sh
yarn test
```

### Api Documentation

for the API documentation, you can access the swagger documentation by running the server and open the browser with this url :

```sh
http://localhost:3000/api-docs
```
note: if you want to use the real API documentation, you can use the postman collection that is available in the root folder of this project.
