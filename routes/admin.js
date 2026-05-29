import express from 'express'
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

export default router