// import express from 'express';
const express = require('express')
const morgan = require('morgan');

const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(morgan('tiny'));

app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>");
  });

// morgan.token('persons', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req.body JSON.stringify - :req[content-length]'));



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/info', (request, response) => {
    const number = persons.length
    const nDate = new Date();
      
    console.log(nDate);

    response.json(`Phonebook has info for ${number} people. ${nDate}`)
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
//   ex 3.5
  const generateId = (min, max) => {
        min = Math.ceil(persons.length)
        max = Math.floor(persons.length + 1000)
    const maxId =  Math.floor(Math.random() * (max - min + 1) + min )
   
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    // ex 3.6
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number is missing' 
      })
    }
    else if (persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
        return response.status(400).json({ 
            error: 'The name already exists in the phonebook' 
    })
    }
  
    persons = persons.concat(newPerson)
  
    response.json(newPerson)
  })
  
  const unknownEndpoint = (req, res) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)



  // const PORT = 3001
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })