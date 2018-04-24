/* eslint-env mocha */
const moment = require('moment')
const mongoose = require('mongoose')
const expect = require('chai').expect
require('chai').should()

const config = require('./lib/config.json')
const softDeletedPlugin = require('../index')
const foodSchema = require('./lib/foodSchemaFactory')()

describe('deletedAt', () => {
  let FoodModel

  before(async () => {
    // init mongoose
    const connection = await mongoose.connect(config.mongoURL)
    // register plugin before get model instance
    foodSchema.plugin(softDeletedPlugin, { deletedAt: true })
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

  it('pizza.deleted === false && pizza.deletedAt === null', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.should.not.be.an('undefined')
    pizza.deleted.should.be.equal(false)
    expect(pizza.deletedAt).to.be.a('null')
  })

  it('eat the pizza', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    await pizza.delete()
    pizza.deleted.should.be.equal(true)
    pizza.deletedAt.should.not.be.a('null')
  })

  it('RESTORE the pizza from the stomach', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    await pizza.restore()
    pizza.deleted.should.be.equal(false)
    expect(pizza.deletedAt).to.be.a('null')
  })

  it('add a burger and steak', async () => {
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
    pizza.deletedAt.getTime().should.be.an('number')

    const burger = await FoodModel.findOne({ name: 'burger' })
    burger.deleted.should.be.equal(true)
    burger.deletedAt.getTime().should.be.an('number')

    const steak = await FoodModel.findOne({ name: 'steak' })
    steak.deleted.should.be.equal(false)
    expect(steak.deletedAt).to.be.an('null')
  })

  it('RESTORE food with calorie under 700, so pizza and burger should be restored', async () => {
    const result = await FoodModel.restore({
      calorie: {
        $lt: 700
      }
    })
    result.ok.should.be.equal(1)
    result.n.should.be.equal(2)

    const pizza = await FoodModel.findOne({ name: 'pizza' })
    pizza.deleted.should.be.equal(false)
    expect(pizza.deletedAt).to.be.an('null')

    const burger = await FoodModel.findOne({ name: 'burger' })
    burger.deleted.should.be.equal(false)
    expect(burger.deletedAt).to.be.an('null')

    const steak = await FoodModel.findOne({ name: 'steak' })
    steak.deleted.should.be.equal(false)
    expect(steak.deletedAt).to.be.an('null')
  })

  it('should have eaten pizza yesterday', async () => {
    const pizza = await FoodModel.findOne({ name: 'pizza' })
    const when = moment().subtract(1, 'day').toDate()
    await pizza.delete(when)
    pizza.deleted.should.be.equal(true)
    pizza.deletedAt.getTime().should.be.equal(when.getTime())
  })

  it('should have eaten burger yesterday', async () => {
    const when = moment().subtract(1, 'day').toDate()
    await FoodModel.delete({ name: 'burger' }, when)
    const burger = await FoodModel.findOne({ name: 'burger' })
    burger.deleted.should.be.equal(true)
    burger.deletedAt.getTime().should.be.equal(when.getTime())
  })
})
