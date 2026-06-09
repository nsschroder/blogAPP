import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

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
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash("error_msg", "E-mail já cadastrado")

                res.redirect("/usuarios/registro")
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                // criptografia da senha --------------------------------------------------------------
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Houve um erro ao salvar usuário")
                            res.redirect("/")
                        }

                        newUser.password = hash
                        // ----------------------------------------------------- -------------------------------                      
                        newUser.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso!")
                            res.redirect("/")
                        }).catch((error) => {
                            req.flash("error_msg", "Houve um erro ao criar usuário!")

                            res.redirect("/usuarios/registro")
                        })
                    })
                })
            }
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

export default router