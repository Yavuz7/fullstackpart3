require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const phoneEntry = require('./models/phoneEntry')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

morgan.token('body', (request) => JSON.stringify(request.body))

const errorHandler = (error, request, response, next) => {
  // If statusCode set it, otherwise default to 500
  //Code derived from : https://youtu.be/WXa1yzLR3hw?si=mR8jMRqbkairPeTn
  error.statusCode = error.statusCode || 500
  response.status(error.statusCode).json({
    status: error.statusCode,
    error: error.message,
  })
  console.error(error.message)
  next(error)
}

app.get('/info', (request, response) => {
  let persons
  const date = new Date()
  phoneEntry.find({}).then((people) => {
    persons = people.length
    response.send(`<h2>Phonebook has info for ${persons} people!</h2><br/>
    <p>Time Of Request: ${date} <p>`)
  })
})

app.get('/api/persons', (request, response) => {
  phoneEntry.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  phoneEntry
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        const err = new Error('Person not found')
        err.statusCode = 404
        next(err)
      }
    })
    .catch(() => {
      const err = new Error('malformatted id')
      err.statusCode = 400
      next(err)
    })
})

app.delete('/api/persons/:id', (request, res) => {
  phoneEntry.findByIdAndDelete(request.params.id).then(() => {
    res.status(204).end()
  })
})

app.put('/api/persons/:id', (request, res, next) => {
  phoneEntry
    .findByIdAndUpdate(
      request.params.id,
      { number: request.body.number },
      { new: true, runValidators: true, context: 'query' }
    )
    .then((response) => {
      if (response) {
        res.json(response)
        console.log(response)
      } else {
        const err = new Error('Person No Longer exists I guess?')
        err.statusCode = 400
        next(err)
        return
      }
    })
    .catch(() => {
      const err = new Error('Bad Update Data Oops')
      err.statusCode = 400
      next(err)
    })
})

app.post('/api/persons', (request, res, next) => {
  const newPerson = request.body

  if (!newPerson.name) {
    const err = new Error('Person Needs A Name')
    err.statusCode = 400
    next(err)
    return
  } else if (!newPerson.number) {
    const err = new Error('Person Needs A Number')
    err.statusCode = 400
    next(err)
    return
  }

  const newEntry = new phoneEntry({
    name: newPerson.name,
    number: newPerson.number,
  })

  newEntry
    .save()
    .then((newPerson) => {
      res.json(newPerson)
    })
    .catch(() => {
      const err = new Error('Bad Data Oops')
      err.statusCode = 400
      next(err)
    })
  console.log('Added To Database')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)
