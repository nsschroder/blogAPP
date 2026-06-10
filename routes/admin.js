import express from 'express'
import mongoose from 'mongoose'
import Categoria from '../models/Categoria.js'
import Post from '../models/Post.js'
import { eAdmin } from '../helpers/eAdmin.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")
})

router.get('/post', eAdmin, (req, res) => {
    res.send("Página de posts")
})

router.get('/categoria', eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).lean().then((categoria) => {
        res.render("admin/categorias", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categoria/add', eAdmin, (req, res) => {
    res.render("admin/addcategoria")
})

router.post('/categoria/new', eAdmin, (req, res) => {

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

router.get('/categoria/edit/:id', eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/admin/categoria")
    })

})

router.post('/categoria/edit', eAdmin, (req, res) => {

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

router.post("/categoria/del", eAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria excluída com sucesso!")
        res.redirect("/admin/categoria")
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao excluir categoria!")
        res.redirect("/admin/categoria")
    })
})

router.get("/postagem", eAdmin, (req, res) => {

    Post.find().lean().populate({ path: 'cat', strictPopulate: false }).sort({ date: "desc" }).then((postagem) => {
        res.render("admin/posts", { postagem: postagem })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens!")
        res.redirect("/admin")
    })

})

router.get("/postagem/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categoria) => {
        res.render("admin/addpost", { categoria: categoria })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário!")
        res.redirect("/admin")
    })

})

router.post("/postagem/new", eAdmin, (req, res) => {

    let erros = []

    if (!req.body.title) {
        erros.push({ text: "Título inválido!" })
    }

    if (!req.body.slug) {
        erros.push({ text: "Slug inválido!" })
    }

    if (!req.body.desc) {
        erros.push({ text: "Descrição inválida!" })
    }

    if (!req.body.cont) {
        erros.push({ text: "Conteúdo inválido!" })
    }

    if (!req.body.cat) {
        erros.push({ text: "Selecione uma categoria!" })
    }

    if (erros.length > 0) {

        res.render("admin/addpost", { erros: erros })
    } else {

        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            desc: req.body.desc,
            cont: req.body.cont,
            cat: req.body.cat
        }
        new Post(newPost)
            .save()
            .then(() => {
                req.flash("success_msg", "Postagem criada com sucesso!")
                res.redirect("/admin/postagem")
            })
            .catch((error) => {
                console.log(error)
                req.flash("error_msg", "Erro ao criar postagem!")
                res.redirect("/admin/postagem/add")
            })
    }
})

router.get("/postagem/edit/:id", eAdmin, (req, res) => {

    Post.findOne({ _id: req.params.id }).populate("cat").lean().then((postagem) => {

        Categoria.find().lean().then((categoria) => {
            res.render("admin/editpost", { categoria: categoria, postagem: postagem })

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/admin/postagem")
        })


    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição!")
        res.redirect("/admin/postagem")
    })

})

router.post("/postagem/edit", eAdmin, (req, res) => {

    let erros = []

    if (!req.body.title) {
        erros.push({ text: "Título inválido!" })
    }

    if (!req.body.slug) {
        erros.push({ text: "Slug inválido!" })
    }

    if (!req.body.desc) {
        erros.push({ text: "Descrição inválida!" })
    }

    if (!req.body.cont) {
        erros.push({ text: "Conteúdo inválido!" })
    }

    if (!req.body.cat) {
        erros.push({ text: "Selecione uma categoria!" })
    }

    if (erros.length > 0) {

        return Categoria.find().lean().then((categoria) => {

            Post.findOne({ _id: req.body.id })
                .populate("cat")
                .lean()
                .then((postagem) => {

                    res.render("admin/editpost", {
                        erros,
                        categoria,
                        postagem
                    })

                })

        })

    }

    Post.findOne({ _id: req.body.id })
        .then((postagem) => {

            postagem.title = req.body.title
            postagem.slug = req.body.slug
            postagem.desc = req.body.desc
            postagem.cont = req.body.cont
            postagem.cat = req.body.cat

            return postagem.save()

        })
        .then(() => {

            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagem")

        })
        .catch((error) => {

            console.log(error)

            req.flash("error_msg", "Houve um erro ao editar a postagem!")
            res.redirect("/admin/postagem")

        })

})

router.post("/postagem/del", eAdmin, (req, res) => {

    Post.deleteOne({ _id: req.body.id })
        .then(() => {

            req.flash("success_msg", "Postagem excluída com sucesso!")
            res.redirect("/admin/postagem")

        })
        .catch((error) => {

            console.log(error)

            req.flash("error_msg", "Erro ao excluir postagem!")
            res.redirect("/admin/postagem")

        })

})

router.get("/users", eAdmin, (req, res) => {

    User.find().lean().then((users) => {
        res.render("admin/users", {
            users: users
        })
    })

})

router.post("/users/admin", eAdmin, (req, res) => {

    User.findByIdAndUpdate(
        req.body.id,
        {
            eAdmin: 1
        }
    )
        .then(() => {

            req.flash(
                "success_msg",
                "Usuário promovido para administrador"
            )

            res.redirect("/admin/users")

        })
        .catch(() => {

            req.flash(
                "error_msg",
                "Erro ao alterar permissões"
            )

            res.redirect("/admin/users")

        })

})
router.post("/users/removeadmin", eAdmin, (req, res) => {

    if (req.user.id == req.body.id) {

        req.flash(
            "error_msg",
            "Você não pode remover suas próprias permissões."
        )

        return res.redirect("/admin/users")
    }

    User.findByIdAndUpdate(
        req.body.id,
        { eAdmin: 0 }
    )
        .then(() => {

            req.flash(
                "error_msg",
                "Permissão de administrador removida"
            )

            res.redirect("/admin/users")

        })
        .catch(() => {

            req.flash(
                "error_msg",
                "Erro ao remover permissão"
            )

            res.redirect("/admin/users")

        })

})

export default router