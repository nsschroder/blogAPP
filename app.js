import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { engine } from 'express-handlebars'
import admin from './routes/admin.js'
import session from 'express-session'
import flash from 'connect-flash'
import Post from './models/Post.js'

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
    next()
})



app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handlebars
// Converter em "XX de janeiro de 2026"
app.engine('handlebars', engine({
    helpers: {
        formatDate: function (date) {
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }).format(new Date(date))
        }
    }
}))
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
    Post.find().populate("cat").sort({ date: "desc" }).then((postagem) => {
        res.render("index", { postagem: postagem })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })

})

app.get("/404", (re, res) => {
    res.send("Erro 404!")
})

app.use('/admin', admin)

// Outros | Server
const PORT = 8081

app.listen(PORT, () => {
    console.log("Servidor funcionando!")
})