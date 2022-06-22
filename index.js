require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person.js')
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {skip: (req, res) => req.method !== 'POST'}))
app.use(morgan('tiny', {skip: (req) => req.method === 'POST'}))

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
];

const generateId = () => {
    return Math.round(Math.random()*1000000);
}

app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(response => {
        res.json(response);
    })    
})
app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${Date()}</p>`
         );
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person =>  person.id === id);
    if(!person) {
        return res.status(404).end();
    }
    res.json(person);
})
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id)
    .then(result => {
        res.status(204).end();
    })
    .catch((err) => {
        console.log(err);
    })
});
app.post('/api/persons', (req, res) => {
    const person = new Person({
        ...req.body
    })
    person.save()
    .then(savedPerson => {
        res.send(savedPerson);
    })
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})