const _ = require('lodash')

const DELETED_FIELD_NAME = 'deleted'

/**
 * pluginSoftDeletedFactory
 * creates a mongoose plugin with the options given
 *
 * @param {*} opts options
 */
function pluginSoftDeletedFactory (opts) {
  // where init the options

  // the factory returns the plugin method
  return function (schema, opts = {}) {
    const schemaPatch = {}
    schemaPatch[DELETED_FIELD_NAME] = 'boolean'
    schema.add(schemaPatch)
  }
}

module.exports = pluginSoftDeletedFactory
