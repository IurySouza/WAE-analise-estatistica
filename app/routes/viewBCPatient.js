const express = require('express')
const router = express()

const BCP_Utils = require('../helpers/viewBCPatientHelper')
const utils = new BCP_Utils()

const db = require('../models/index')
const User = db.User
const BCPatient = db.BCPatient
const Table = db.Table

router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    const db_user = await User.findOne({
        where: { id: req.query.id_u },
        raw: true
    })

    const data = await utils.querySelector(req.query.attribute)
    const labels = await utils.getLabels(req.query.attribute)

    res.render('../app/views/viewPatientTable', {
        id_u: req.query.id_u, 
        id_t: req.query.id_t, 
        db_user,
        data, 
        labels, 
        url_edit_user: '/home/editarUsuario?id=' + req.query.id_u, 
        url_logout: '/home/logout'
    })
})

router.post('/filter', (req, res) => {
    const attribute = req.body.show_data_for
    res.redirect(`/BCPatient?id_t=${req.body.id_t}&id_u=${req.body.id_u}&attribute=${attribute}`)
})

module.exports = router