const express = require("express")
const request = require("request")
const app = express()
const path = require("path")
const Livro = require('./models/livro')
const methodOverride = require('method-override')

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('busca')
})

let resposta = {}

app.get('/busca', (req, res) => {
    let {busca, tipo} = req.query
    if (!tipo) tipo = ""
    request("https://www.googleapis.com/books/v1/volumes?q="+ tipo + busca, (error, response, body) => {
        if(!error && response.statusCode == 200){
            resposta = JSON.parse(body)
        }
        res.render('resultadoBusca', {resposta})
    })
})

app.post('/livros/:id', async(req, res) => {
    const {id} = req.params
    if (resposta.totalItems > 0) {
        for (item of resposta.items){
            if (item.id == id){
                const livro = item.volumeInfo
                const livroEncontrado = await Livro.find({title: livro.title})
                const thumbnail = livro.imageLinks ? livro.imageLinks.thumbnail : "";
                if (livroEncontrado.length == 0){
                    const novoLivro = new Livro({title: livro.title, authors: livro.authors, industryIdentifiers: livro.industryIdentifiers, thumbnail: thumbnail})
                    await novoLivro.save()
                    console.log("Livro salvo!")
                } else {
                    console.log("Livro já está salvo na lista de favoritos.")
                }
            }
        }
    }
})

app.get('/livros', async(req, res) => {
    const livros = await Livro.find({})
    res.render('livros/index', {livros})
})

app.get('/livros/:id', async(req, res) => {
    const {id} = req.params
    const livro = await Livro.findById(id)
    if (livro)
        res.render('livros/show', {livro})
    else
        res.send('O livro não foi encontrado.')
})


app.delete('/livros/:id', async(req, res) => {
    const {id} = req.params
    await Livro.findByIdAndDelete(id)
    res.redirect('/livros')
})

app.listen(3000, () => {
    console.log("Servidor ligado na porta 3000!")
})