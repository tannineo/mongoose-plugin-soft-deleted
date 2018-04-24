const debug = require('debug')('mongoose-plugin-soft-deleted')

/**
 * pluginSoftDeleted
 *
 * @param {*} opts options
 */
function pluginSoftDeleted (schema, opts) {
  debug('has opts: %O', opts)
  const ifAddDeletedAt = opts.deletedAt || false

  // default to add deleted field
  const schemaToAdd = {
    deleted: {
      type: Boolean,
      default: false
    }
  }
  // add deletedAt field
  if (ifAddDeletedAt) schemaToAdd.deletedAt = { type: Date, default: null }

  schema.add(schemaToAdd)

  // add delete and restore method
  /**
   * delete
   * @param {Date} deletedAt the time when you delete the doc
   */
  schema.methods.delete = async function (deletedAt) {
    this.deleted = true
    if (ifAddDeletedAt) this.deletedAt = deletedAt || new Date()

    return this.save()
  }

  /**
   * delete
   * @param {*} conditions
   * @param {Date} deletedAt the time when you delete the doc
   */
  schema.statics.delete = async function (conditions, deletedAt) {
    const updateData = {
      $set: {
        deleted: true
      }
    }
    if (ifAddDeletedAt) updateData.$set.deletedAt = deletedAt || new Date()

    return this.updateMany(
      conditions,
      updateData
    )
  }

  /**
   * restore
   */
  schema.methods.restore = async function () {
    this.deleted = false
    if (ifAddDeletedAt) this.deletedAt = null
    return this.save()
  }

  /**
   * restore
   * @param {*} conditions
   */
  schema.statics.restore = async function (conditions) {
    const updateData = {
      $set: {
        deleted: false
      }
    }
    if (ifAddDeletedAt) updateData.$set.deletedAt = null

    return this.updateMany(
      conditions,
      updateData
    )
  }

  // adding custom methods
  schema.statics.countNoDeleted = async function (conditions) {
    conditions.deleted = false
    return this.count(conditions)
  }
}

module.exports = pluginSoftDeleted
