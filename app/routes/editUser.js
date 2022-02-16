const express = require('express')
const router = express()

const db = require('../models/index')
const User = db.User

router.get('/', async (req, res) => {
    const db_user = await User.findOne({
        where: { id: req.query.id },
        raw: true
    })

    res.render('../app/views/editUser', { db_user })
})

router.post('/update', async (req, res) => {
    await User.update(
        { name: req.body.update_name ? req.body.update_name : undefined, 
          email: req.body.update_email ? req.body.update_email : undefined,
          password: req.body.update_password ? req.body.update_password : undefined },
        {
            where: { id: req.body.id },
            raw: true
        })

    res.redirect('../../home?id=' + req.body.id)
})

module.exports = router