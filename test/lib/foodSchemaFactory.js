const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {
  return Schema({
    name: String,
    calorie: Number,
    taste: Object,
    bestBefore: Date
  })
}
