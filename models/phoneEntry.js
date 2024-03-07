const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        let arrayOfNumbers = v.split("-");
        if (
          arrayOfNumbers[0].length >= 2 &&
          arrayOfNumbers[0].length <= 3 &&
          arrayOfNumbers.length == 2 &&
          !isNaN(arrayOfNumbers[0]) &&
          !isNaN(arrayOfNumbers[1])
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
});

entrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("phoneEntry", entrySchema);
