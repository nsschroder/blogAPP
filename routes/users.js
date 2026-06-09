import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.get('/registro', (req, res) => {
    res.render('users/registro')
})

export default router