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
    Categoria.find().sort({ date: 'desc' }).lean().then((categoria) => {
        res.render("admin/categorias", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
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

// Botão de editar blog

router.get('/categoria/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/admin/categoria")
    })

})

router.post('/categoria/edit', (req, res) => {

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
        return res.render("admin/editcategoria", {
            erros: erros,
            categoria: req.body
        })
    }

    Categoria.findOne({ _id: req.body.id })
        .then((categoria) => {

            categoria.name = req.body.name
            categoria.slug = req.body.slug

            return categoria.save()

        })
        .then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categoria")
        })
        .catch((err) => {
            req.flash("error_msg", "Erro ao editar categoria.")
            res.redirect("/admin/categoria")
        })
})

router.post("/categoria/del", (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria excluída com sucesso!")
        res.redirect("/admin/categoria")
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao excluir categoria!")
        res.redirect("/admin/categoria")
    })
})


export default router