import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { engine } from 'express-handlebars'
import admin from './routes/admin.js'
import session from 'express-session'
import flash from 'connect-flash'
import Post from './models/Post.js'
import Categoria from './models/Categoria.js'
import users from './routes/users.js'

const app = express()

// CONFIGURAÇÕES GERAIS E MIDDLEWARES

// SESSÃO
app.use(session({
    secret: "projetoblogapp",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// MIDDLEWARE GLOBAL
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

// PARSERS
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handlebars
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

// PUBLIC
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

// ROTAS

app.get('/', (req, res) => {
    Post.find().populate("cat").sort({ date: "desc" }).lean().then((postagem) => {
        res.render("index", { postagem: postagem })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
})

app.get('/categoria', (req, res) => {
    Categoria.find().lean().then((categoria) => {
        res.render("categoria/index", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect('/')
    })
})

app.get('/categoria/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug })
        .lean()
        .then((categoria) => {
            if (categoria) {
                Post.find({ cat: categoria._id })
                    .lean()
                    .then((postagem) => {
                        res.render("categoria/postagem", {
                            postagem: postagem,
                            categoria: categoria
                        })
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Houve um erro ao listar os posts")
                        res.redirect('/')
                    })
            } else {
                req.flash("error_msg", "Essa categoria não existe")
                res.redirect('/')
            }
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
        })
})

app.get('/postagem/:slug', (req, res) => {
    Post.findOne({ slug: req.params.slug }).populate("cat").lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Essa postagem não existe")
            res.redirect("/")
        }
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("Erro 404!")
})

// USUARIOS
app.use('/usuarios', users)
app.use('/admin', admin)

// SERVIDOR

const PORT = 8081

app.listen(PORT, () => {
    console.log("Servidor funcionando!")
})