/* eslint-env mocha */
const mongoose = require('mongoose')
require('chai').should()
const expect = require('chai').expect

const config = require('./lib/config.json')
const softDeletedPlugin = require('../index')
const foodSchema = require('./lib/foodSchemaFactory')()

describe('findOneNoDeleted', () => {
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

  it('findOneNoDeleted name = pizza', async () => {
    const pizza = await FoodModel.findOneNoDeleted({ name: 'pizza' })
    pizza._id.should.not.be.an('undefined')
  })

  it('eat pizza && findOneNoDeleted === null', async () => {
    await FoodModel.delete({ name: 'pizza' })
    const pizza = await FoodModel.findOneNoDeleted({ name: 'pizza' })
    expect(pizza).to.be.an('null')
  })
})
