import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { engine } from 'express-handlebars'
import admin from './routes/admin.js'
import session from 'express-session'
import flash from 'connect-flash'

const app = express()


// Configs

// Sessao
app.use(session({
    secret: "projetoblogapp",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// Middleware

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
})
next()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Mongoose

mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conexão ao mongo bem sucedida...")
}).catch((error) => {
    console.log("Erro ao se conectar no mongo: " + error)
})

// Public
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

//Rotas


app.get('/', (req, res) => {
    res.send('Rota Principal')
})

app.use('/admin', admin)

// Outros | Server
const PORT = 8081

app.listen(PORT, () => {
    console.log("Servidor funcionando!")
})