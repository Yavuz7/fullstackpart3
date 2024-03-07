const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yavuzyurtseven1:${password}@testclusterowo.nybeoyx.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=TestClusterOwO`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const phoneEntry = mongoose.model('phoneEntry', entrySchema)

if (process.argv.length === 3) {
  phoneEntry.find({}).then((result) => {
    console.log('Phonebook: ')
    result.forEach((note) => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const entry = new phoneEntry({
    name: process.argv[3],
    number: process.argv[4],
  })

  entry.save().then(() => {
    console.log('Phone book entry sent!')
    mongoose.connection.close()
  })
}
