/**
 * pluginSoftDeleted
 *
 * @param {*} opts options
 */
function pluginSoftDeleted (schema, opts) {
  const ifAddDeletedAt = opts.deletedAt || false

  // add deleted field
  schema.add({
    deleted: {
      type: Boolean,
      default: false
    }
  })
  // add deletedAt field
  if (ifAddDeletedAt) {
    schema.add({
      deletedAt: {
        type: Date,
        default: () => new Date()
      }
    })
  }

  // add delete and restore method
  /**
   * delete
   * @param {Date} deletedAt the time when you delete the doc
   */
  schema.methods.delete = async function (deletedAt = new Date()) {
    if (!(deletedAt instanceof Date)) {
      throw new Error('deletedAt should be a Date')
    }

    this.deleted = true
    if (ifAddDeletedAt) this.deletedAt = deletedAt

    return this.save()
  }

  /**
   * delete
   * @param {*} conditions
   * @param {Date} deletedAt the time when you delete the doc
   */
  schema.statics.delete = async function (conditions, deletedAt = new Date()) {
    const updateData = {
      $set: {
        deleted: true
      }
    }
    if (ifAddDeletedAt) updateData.$set.deletedAt = deletedAt

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
}

module.exports = pluginSoftDeleted
