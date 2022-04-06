const express = require('express')
const router = express()

const fs = require('fs')
const ReportGenerator = require('../helpers/generateReportHelper2')
const reportGenerator = new ReportGenerator()

const BCP_Utils = require('../helpers/viewBCPatientHelper')
const utils = new BCP_Utils()

const db = require('../models/index')
const User = db.User

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
        data_sum: utils.getDataSum(data),
        labels,
        conditions: utils.getConditions(p),
        title: utils.getPropertyName(p.show_data_for),
        url_edit_user: '/home/editarUsuario?id=' + p.id_u,
        url_logout: '/home/logout'
    })
})

router.post('/filter', (req, res) => {
    res.redirect(`/BCPatient?p=${JSON.stringify(req.body)}`)
})

// router.post('/addReport', async (req, res) => {
//     await reportGenerator.createQueryResultGraphs(JSON.parse(req.body.labels), JSON.parse(req.body.data))
//     res.redirect('back')
// })

router.post('/addReport2', async (req, res) => {
    const path = `${__dirname}/../public/reportData.json`
    const report_data = JSON.parse(req.body.report_data)
    report_data.filepaths = await reportGenerator.createQueryResultGraphs(report_data)

    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.err(err)
        }
        const dataFile = JSON.parse(data)
        dataFile.report.push(report_data)

        fs.writeFile(path, JSON.stringify(dataFile), err => console.err(err))
    })
    
    res.redirect('back')
})

// router.post('/generateReport', async (req, res) => {
//     await reportGenerator.generateReport(JSON.parse(req.body.conditions))
//     res.download(`${__dirname}/../public/Relatório.pdf`)
// })

router.post('/generateReport2', async (req, res) => {
    await reportGenerator.generateReport()
    res.redirect('back')
    //res.download(`${__dirname}/../public/Relatório.pdf`)
})

module.exports = router