const mongoose = require('mongoose')
const Schema = mongoose.Schema
const foodSchema = Schema({
  name: String,
  calorie: Number,
  taste: Object,
  bestBefore: Date
})

module.exports = foodSchema
