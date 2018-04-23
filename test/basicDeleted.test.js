/* eslint-env mocha */
const mongoose = require('mongoose')
require('chai').should()

const config = require('./lib/config.json')
const softDeletedPlugin = require('../index')
const foodSchema = require('./lib/foodSchemaFactory')()

describe('basic deleted', () => {
  let FoodModel

  before(async () => {
    // init mongoose
    const connection = await mongoose.createConnection(config.mongoURL)
    // register plugin before get model instance
    foodSchema.plugin(softDeletedPlugin, {})
    FoodModel = connection.model('food', foodSchema)
  })

  after(async () => {
    // drop db
    await FoodModel.db.dropDatabase()
  })

  it('add a food called pizza', async () => {
    const result = await FoodModel.create({
      name: 'pizza',
      calorie: 233,
      taste: 'good!',
      bestBefore: new Date()
    })
    result._id.should.not.be.an('undefined')
  })

  it('pizza.deleted === false', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.should.not.be.an('undefined')
    pizza.deleted.should.be.equal(false)
  })

  it('the pizza should be able to delete itself', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.should.not.be.an('undefined')
    pizza.deleted.should.be.equal(false)
    const result = await pizza.delete()
    result.deleted.should.be.equal(true)
  })

  it('the pizza should be able to resotre itself', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.should.not.be.an('undefined')
    pizza.deleted.should.be.equal(true)
    const result = await pizza.restore()
    result.deleted.should.be.equal(false)
  })

  it('add a burger and a steak', async () => {
    let result = await FoodModel.create({
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

  it('eat(delete) food with calorie under 700, so pizza and burger should be deleted', async () => {
    const result = await FoodModel.delete({
      calorie: {
        $lt: 700
      }
    })
    result.ok.should.be.equal(1)
    result.n.should.be.equal(2)
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.deleted.should.be.equal(true)
    const burger = await FoodModel.findOne({ name: 'burger' })
    burger.deleted.should.be.equal(true)
    const steak = await FoodModel.findOne({ name: 'steak' })
    steak.deleted.should.be.equal(false)
  })

  it('buy(restore) food with calorie under 700, so pizza and burger should be restored', async () => {
    const result = await FoodModel.restore({
      calorie: {
        $lt: 700
      }
    })
    result.ok.should.be.equal(1)
    result.n.should.be.equal(2)
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.deleted.should.be.equal(false)
    const burger = await FoodModel.findOne({ name: 'burger' })
    burger.deleted.should.be.equal(false)
    const steak = await FoodModel.findOne({ name: 'steak' })
    steak.deleted.should.be.equal(false)
  })
})
