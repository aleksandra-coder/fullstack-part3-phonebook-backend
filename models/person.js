/* eslint-disable linebreak-style */
// ex 3.13
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// ex 3.19
const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true, unique: true },
  number: { type: String, minLength: 8, unique: true, required: true },
})

// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Person', personSchema)