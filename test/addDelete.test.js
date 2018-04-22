const mongoose = require('mongoose')
const config = require('./lib/config.json')
const expect = require('chai').expect

const FoodModel = require('./lib/FoodModel')

describe('add deleted', () => {
  before(async () => {
    // init mongoose
    await mongoose.connect(config.mongoURL)
  })

  after(async () => {
    await FoodModel.db.dropDatabase()
  })

  it('', async () => {
    
  })
})
