/* eslint-disable linebreak-style */
// import express from 'express';
const express = require('express')
const morgan = require('morgan')

const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

app.use(express.static('build'))

app.use(morgan('tiny'))

// app.get("/", (req, res) => {
//     res.send("<h1>Hello world!</h1>");
//   });

// ex 3.8
// morgan.token('persons', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req.body JSON.stringify - :req[content-length]'));



// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]


//  ex 3.18
app.get('/info', (request, response) => {
  const nDate = new Date()
  Person.find({}).then(persons => {
    // Person.length
    response.json(`Phonebook has info for ${Person.length} people. ${nDate}`)
  })

})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

// ex 3.13
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    // error handling:
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)

//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })

//   ex 3.5
// const generateId = (min, max) => {
//       min = Math.ceil(persons.length)
//       max = Math.floor(persons.length + 1000)
//   const maxId =  Math.floor(Math.random() * (max - min + 1) + min )

//   return maxId + 1
// }

// app.post('/api/persons', (request, response) => {
//   const body = request.body
//   const newPerson = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }
//   // ex 3.6
//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'Name or number is missing'
//     })
//   }
//   else if (persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
//       return response.status(400).json({
//           error: 'The name already exists in the phonebook'
//   })
//   }

//   persons = persons.concat(newPerson)

//   response.json(newPerson)
//   console.log(request.body)
// })

// ex 3.14
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (body.name === undefined || body.number === undefined) {
  //   return response.status(400).json({ error: 'Name or number is missing' })
  //  }
  // else if (body.name.length < 3 || body.number.length < 8) {
  //   return console.log('Name or number is too short'),
  //   response.status(400).json({ error: 'Name or number is too short' })

  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // person.save().then(savedPerson => {
  //   response.json(savedPerson)
  // })
  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
  //  it passes any potential exceptions to the error handler middleware:
    .catch(error => next(error))

})

// ex 3.15
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// ex 3.17 updating the person data:
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// ex 3.16
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// const PORT = 3001
// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})