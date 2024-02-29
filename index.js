require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const phoneEntry = require("./models/phoneEntry");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));

morgan.token("body", (request) => JSON.stringify(request.body));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<h2>Phonebook has info for ${persons.length} people!</h2><br/>
  <p>Time Of Request: ${date} <p>`);
});

app.get("/api/persons", (request, response) => {
  phoneEntry.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  phoneEntry
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  phoneEntry
    .findByIdAndDelete(request.params.id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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
  }

  const newEntry = new phoneEntry({
    name: newPerson.name,
    number: newPerson.number,
  });

  newEntry.save().then((newPerson) => {
    response.json(newPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);
