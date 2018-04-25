# mongoose-plugin-soft-deleted
[![NPM](https://nodei.co/npm/mongoose-plugin-soft-deleted.png)](https://npmjs.org/package/mongoose-plugin-soft-deleted)  
a plugin for mongoose adding soft delete features

support`mongoose@5.0.x`

## Feautres
  - add a field `deleted` to the schema
  - add instance and static methods `delete` and `restore` to the schema
  - options to add `deletedAt` which is `Date`
  - provide methods to append `deleted: false` automatically like:
    - `async countNoDelete(cond)`
    - `async findOneNoDeleted(cond)`
    - `async findNoDeleted(cond)`

## TODO
  - add indexing support
  - [ ] override or overwrite basic `find` `findOne` `update` `updateMany` `count` etc...
    - Please notice that mongoose offical doc doesn't recommend to override methods already exist
    - consider using middleware
  - [ ] add `index.d.ts`

## Usage
  - `npm i --save mongoose-plugin-soft-deleted`
  - before creating schemas, register the plugin globally:
  ```js
  const mongoose = require('mongoose')
  const softDeleted = requrie('mongoose-plugin-soft-deleted')
  
  const mongoCon = mongoose.createConnection('mongodb://localhost:27017/test')
  mongoCon.plugin(softDeleted, options)
  ```
  - or use it for a single schema, before creating a model:
  ```js
  const mongoose = require('mongoose')
  const softDeleted = requrie('mongoose-plugin-soft-deleted')

  const foodSchema = mongoose.Schema({ name: String, bestBefore: Date })
  foodSchema.plugin(softDeleted, options)
  ```
  - `options` above is like:
  ```js
  {
    deletedAt: true  // true to set a deletedAt timestamp while deleting a doc
  }
  ```

## Methods
```
WIP
```

## Develop & Test
  - prepare a mongodb instance with no authentication(simply localhost with a new mongo) and create a new test db(usually `test`)
  - edit `./test/lib/config.json`
  - run the npm script `test`
  - write things as you like under [js-standard-style](https://standardjs.com/)

## About
Nyan Nyan Nyan
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)  
