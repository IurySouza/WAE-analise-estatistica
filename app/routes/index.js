const express = require('express')
const router = express()

const db = require('../models/index')
const User = db.User

router.use(express.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.render('../app/views/index')
})

// TODO: Verificação de email e confirmação de senha
router.post('/cadastro', async (req, res) => {
    await User.create({
        name: req.body.register_name,
        email: req.body.register_email,
        password: req.body.register_password
    })
    res.redirect('back')
})

router.post('/login', async (req, res) => {
    const db_user = await User.findOne({
        where: { email: req.body.login_email },
        raw: true
    })

    if (db_user != null && db_user.password == req.body.login_password) {
        res.redirect('home?id=' + db_user.id)
    } else {
        res.redirect('back')
    }

})

module.exports = router