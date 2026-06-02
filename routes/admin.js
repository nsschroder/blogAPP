import express from 'express'
import mongoose from 'mongoose'
import Categoria from '../models/Categoria.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/post', (req, res) => {
    res.send("Página de posts")
})

router.get('/categoria', (req, res) => {
    res.render("admin/categorias")
})

router.get('/categoria/add', (req, res) => {
    res.render("admin/addcategoria")
})

router.post('/categoria/new', (req, res) => {

    let erros = []

    if (!req.body.name) {
        erros.push({ text: "Nome inválido!" })
    }

    if (!req.body.slug) {
        erros.push({ text: "Slug inválido!" })
    }

    if (req.body.name && req.body.name.length < 2) {
        erros.push({ text: "Mínimo de 2 caracteres no nome!" })
    }

    if (erros.length > 0) {
        return res.render("admin/addcategoria", { erros })
    } else {
        const newCat = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Categoria(newCat)
            .save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!")
                res.redirect("/admin/categoria")
            })
            .catch((error) => {
                req.flash("error_msg", "Houve um erro ao criar a categoria, tente novamente!")
                res.redirect("/admin")
            })

    }


})

export default router