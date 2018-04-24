/* eslint-env mocha */
const mongoose = require('mongoose')
require('chai').should()

const config = require('./lib/config.json')
const softDeletedPlugin = require('../index')
const foodSchema = require('./lib/foodSchemaFactory')()

describe('countNoDeleted', () => {
  let FoodModel

  before(async () => {
    // init mongoose
    const connection = await mongoose.createConnection(config.mongoURL)
    // register plugin before get model instance
    foodSchema.plugin(softDeletedPlugin, { deletedAt: true })
    FoodModel = connection.model('food', foodSchema)
  })

  after(async () => {
    // drop db
    await FoodModel.db.dropDatabase()
  })

  it('add pizaa, burger and steak', async () => {
    let result = await FoodModel.create({
      name: 'pizza',
      calorie: 233,
      taste: 'good!',
      bestBefore: new Date()
    })
    result._id.should.not.be.an('undefined')
    result = await FoodModel.create({
      name: 'burger',
      calorie: 666,
      taste: 'great!',
      bestBefore: new Date()
    })
    result._id.should.not.be.an('undefined')
    result = await FoodModel.create({
      name: 'steak',
      calorie: 999,
      taste: 'fantastic!',
      bestBefore: new Date()
    })
    result._id.should.not.be.an('undefined')
  })

  it('count all the food === 3', async () => {
    const result = await FoodModel.countNoDeleted({})
    result.should.be.equal(3)
  })

  it('eat pizza, count === 2', async () => {
    await FoodModel.delete({ name: 'pizza' })
    const result = await FoodModel.countNoDeleted({})
    result.should.be.equal(2)
  })

  it('count now with calorie above 700, count === 1', async () => {
    const result = await FoodModel.countNoDeleted({ calorie: { $gt: 700 } })
    result.should.be.equal(1)
  })
})
