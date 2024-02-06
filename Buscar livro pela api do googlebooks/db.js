const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/dbLivros')
    .then(()=>{
        console.log('Conexão estabelecida com o banco.')
    })
    .catch(err => {
        console.log("Erro ao conectar com o banco.")
        console.log(err)
    })

module.exports = mongoose