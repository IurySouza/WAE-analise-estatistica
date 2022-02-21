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

    const attribute = req.query.attribute
    const query_attributes = ['pesticide_exposure', 'estrogen_receptors', 'her2', 'ki67', 'molecular_subtype_tumor',
        'tumor_size', 'histological_grade', 'lymphnodal_metastasis', 'risk_stratification', 'age_diagnosis',
        'early_onset', 'menopause_at_diagnosis', 'weight', 'height', 'bmi', 'trophic_adipose_status']
    const query_where = { table_id: req.query.id_t }
    let labels = ['Não', 'Sim']

    const index = query_attributes.indexOf(attribute)
    query_attributes.splice(index, 1)
    labels = await utils.getLabels(attribute)
    // query_where[attribute] = true
    console.log(labels)

    const db_bc_patient = await BCPatient.findAll({
        include: [{ model: Table, as: 'Table', required: true, attributes: ['name'] }],
        attributes: { exclude: query_attributes },
        where: query_where,
        raw: true
    })

    console.log(db_bc_patient.length)

    res.render('../app/views/viewPatientTable', { db_user, db_bc_patient, labels, url_edit_user: '/home/editarUsuario?id=' + db_user.id, url_logout: '/home/logout' })
})

router.post('/filter', (req, res) => {
    const attribute = req.body.show_data_for
    res.redirect(`/BCPatient?id_t=${req.body.id_t}&id_u=${req.body.id_u}&attribute=${attribute}`)
})

module.exports = router