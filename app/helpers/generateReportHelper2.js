const fs = require('fs')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const pdf = require('pdf-creator-node')

module.exports = class ReportGenerator {

    getImageNames = () => ({
        total_data: `${Date.now()}-total_data`,
        pesticide_unexposed: `${Date.now()}-pesticide_unexposed`,
        pesticide_exposed: `${Date.now()}-pesticide_exposed`,
        risk_stratification_low: `${Date.now()}-risk_stratification_low`,
        risk_stratification_intermediate: `${Date.now()}-risk_stratification_intermediate`,
        risk_stratification_high: `${Date.now()}-risk_stratification_high`
    })

    async generateGraph(title, labels, data, greaterValue) {
        const canvasRenderService = new ChartJSNodeCanvas({ width: 400, height: 400 })

        const configuration = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maxBarThickness: 60,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: greaterValue,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        }

        const imageBuffer = await canvasRenderService.renderToBuffer(configuration)
        fs.writeFileSync(`${__dirname}/../public/tmp/${title}.png`, imageBuffer);
    }

    async createQueryResultGraphs(report_data) {
        const filenames = this.getImageNames()

        await this.generateGraph(filenames.total_data, report_data.labels, report_data.data.total_data, report_data.data.greaterValue)
        await this.generateGraph(filenames.pesticide_exposed, report_data.labels, report_data.data.pesticide_unexposed, report_data.data.greaterValue)
        await this.generateGraph(filenames.pesticide_unexposed, report_data.labels, report_data.data.pesticide_exposed, report_data.data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_low, report_data.labels, report_data.data.risk_stratification_low, report_data.data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_intermediate, report_data.labels, report_data.data.risk_stratification_intermediate, report_data.data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_high, report_data.labels, report_data.data.risk_stratification_high, report_data.data.greaterValue)

        return filenames
    }

    async generateReport() {
        fs.readFile(`${__dirname}/../public/reportData.json`, 'utf-8', (err, data) => {
            let html = fs.readFileSync(`${__dirname}/../public/reportTemplate.html`, 'utf-8')
            const reports = JSON.parse(data)

            console.log(reports.report)

            let options = {}

            let document = {
                html: html,
                data: {
                    reports: reports.report
                },
                path: `${__dirname}/../public/Relatório.pdf`,
                type: ''
            }

            pdf
                .create(document, options)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.error(err)
                })
        })
    }

}