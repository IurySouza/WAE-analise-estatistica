const express = require('express')
const router = express()

const BCP_Utils = require('../helpers/viewBCPatientHelper')
const utils = new BCP_Utils()

const db = require('../models/index')
const User = db.User
const BCPatient = db.BCPatient
const Table = db.Table

const client = require('@jsreport/nodejs-client')('http://localhost:3000')

router.use(express.urlencoded({ extended: true }))

router.get('/', async (req, res) => {
    const p = JSON.parse(req.query.p)

    const db_user = await User.findOne({
        where: { id: p.id_u },
        raw: true
    })

    const data = await utils.querySelector(p.show_data_for, p)
    const labels = await utils.getLabels(p.show_data_for)

    res.render('../app/views/viewPatientTable', {
        id_u: p.id_u,
        id_t: p.id_t,
        db_user,
        data,
        labels,
        title: utils.getPropertyName(p.show_data_for),
        url_edit_user: '/home/editarUsuario?id=' + p.id_u,
        url_logout: '/home/logout'
    })
})

router.post('/filter', (req, res) => {
    res.redirect(`/BCPatient?p=${JSON.stringify(req.body)}`)
})

router.post('/report', (req, res) => {
    async function render() {
        const res = await client.render({
            template: {
                content: 'hello {{someText}}',
                recipe: 'html',
                engine: 'handlebars'
            },
            data: { someText: 'world!!' }
        })

        const bodyBuffer = await res.body()
        console.log(bodyBuffer.toString())
    }

    render().catch(console.error)
})

module.exports = router