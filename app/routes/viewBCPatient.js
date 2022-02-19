const express = require('express')
const router = express()

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

    const db_bc_patient = await BCPatient.findOne({
        where: { table_id: req.query.id_t },
        raw: true
    })

    const db_table = await Table.findOne({
        where: { id: req.query.id_t },
        raw: true
    })

    res.render('../app/views/viewPatientTable', { db_user, db_bc_patient, url_edit_user: '/home/editarUsuario?id=' + db_user.id, url_logout: '/home/logout' })
})

module.exports = router