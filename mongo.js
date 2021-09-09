const { bodyParser } = require('json-server')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ola-p:${password}@cluster0.supdz.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: 'Anna May',
//   number: '32-43-6666',
// })

process.argv.forEach((name, number) => {
    console.log(`${name}: ${number}`);
  });

personSchema.save({}).then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})


Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })