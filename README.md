# mongoose-plugin-soft-deleted
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)  
a plugin for mongoose adding soft delete features

## Feautres
  - add a field `deleted` to the schema
  - add instance and static methods `delete` and `restore` to the schema

## TODO
  - [ ] override or overwrite basic `find` `findOne` `update` `updateMany` `count` etc...
    - lease notice that mongoose offical doc doesn't recommend to override methods already exist
    - consider using middleware
  - [ ] add `index.d.ts`

## Usage
  WIP

## Develop & Test
  - prepare a mongodb instance with no authentication(simply localhost with a new mongo) and create a new test db(usually `test`)
  - edit `./test/lib/config.json`
  - run the npm script `test`
  - write things as you like under [js-standard-style](https://standardjs.com/)

## About
