const express = require('express')
const router = express()

const db = require('../models/index')
const User = db.User
const Table = db.Table

router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    const db_user = await User.findOne({
        where: { id: req.query.id },
        raw: true
    })

    const db_table = await Table.findAll({
        raw: true,
    })

    res.render('../app/views/home', { db_user, db_table, url_edit_user: '/home/editarUsuario?id=' + db_user.id, url_logout: '/home/logout' })
})

router.get('/editarUsuario', async (req, res) => {
    const db_user = await User.findOne({
        where: { id: req.query.id },
        raw: true
    })

    res.redirect('editUser?id=' + db_user.id)
})

router.get('/logout', (req, res) => {
    res.redirect('/')
})

router.get('/tableRedirect', (req, res) => {
    if (req.query.id_t == 0) {
        res.redirect(`../BCPatient?id_t=${req.query.id_t}&id_u=${req.query.id_u}`)
    } else {
        res.redirect(`../viewTable?id_t=${req.query.id_t}&id_u=${req.query.id_u}`)
    }
})

module.exports = router