const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));
morgan.token("body", (request) => JSON.stringify(request.body));
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello Bananas!</h1>");
// });

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<h2>Phonebook has info for ${persons.length} people!</h2><br/>
  <p>Time Of Request: ${date} <p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id != id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;

  if (!newPerson.name) {
    return response.status(400).json({
      error: "Person Needs A Name",
    });
  } else if (!newPerson.number) {
    return response.status(400).json({
      error: "Person Needs A Number",
    });
  } else if (persons.find((person) => person.name === newPerson.name)) {
    return response.status(400).json({
      error: "Person Name Exists",
    });
  }
  console.log(newPerson);

  newPerson.id = Math.floor(Math.random() * 10000000000);

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
