import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.get('/registro', (req, res) => {
    res.render('users/registro')
})

router.post('/registro', (req, res) => {
    let error = []

    if (!req.body.name) {
        error.push({ text: "Nome inválido" })
    }
    if (!req.body.email) {
        error.push({ text: "E-mail inválido" })
    }
    if (!req.body.password) {
        error.push({ text: "Senha inválida" })
    }
    if (!req.body.password2) {
        error.push({ text: "Senha de confirmação inválida" })
    }

    if (req.body.password) {

        if (req.body.password.length < 6) {
            error.push({ text: "A senha deve ter pelo menos 6 caracteres" })
        }


        if (req.body.password !== req.body.password2) {
            error.push({ text: "As senhas não conferem" })
        }
    }

    if (error.length > 0) {
        res.render("users/registro", { error: error })
    } else {

        res.send("Passou nas validações com sucesso!");
    }
})

export default router