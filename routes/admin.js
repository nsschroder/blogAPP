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
    const newCat = {
        name: req.body.name,
        slug: req.body.slug
    }

    new Categoria(newCat).save().then(() => {
        console.log("Categoria salva com sucesso...")
    }).catch((error) => {
        console.log("Erro ao criar nova categoria...")
    })
})

export default router