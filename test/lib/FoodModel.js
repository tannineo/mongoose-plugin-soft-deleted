const mongoose = require('mongoose')
const Schema = mongoose.Schema
const foodSchema = Schema({
  name: String,
  calorie: Number,
  taste: Schema.Types.Mixed,
  bestBefore: Date
})

const FoodModel = mongoose.model('food', foodSchema)

module.exports = FoodModel
