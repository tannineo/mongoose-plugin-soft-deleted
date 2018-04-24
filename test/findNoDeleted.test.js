/* eslint-env mocha */
const mongoose = require('mongoose')
require('chai').should()

const config = require('./lib/config.json')
const softDeletedPlugin = require('../index')
const foodSchema = require('./lib/foodSchemaFactory')()

describe('findNoDeleted', () => {
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

  it('findNoDeleted length === 3', async () => {
    const foods = await FoodModel.findNoDeleted({})
    foods.length.should.be.equal(3)
  })

  it('eat pizza && findNoDeleted length === 2', async () => {
    await FoodModel.delete({ name: 'pizza' })
    const foods = await FoodModel.findNoDeleted({})
    foods.length.should.be.equal(2)
  })
})
