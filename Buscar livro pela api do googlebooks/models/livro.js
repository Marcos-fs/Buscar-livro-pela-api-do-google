const {mongoose} = require('../db')

const livroSchema = new mongoose.Schema({
    title: String,
    authors: [String],
    industryIdentifiers: [{}],
    thumbnail: String
})

const Livro = mongoose.model("Livro", livroSchema)

module.exports = Livro
