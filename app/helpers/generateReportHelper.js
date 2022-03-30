const fs = require('fs')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const PDFDoc = require('pdfkit')

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

    async createQueryResultGraphs(labels, data) {
        const filenames = this.getImageNames()

        await this.generateGraph(filenames.total_data, labels, data.total_data, data.greaterValue)
        await this.generateGraph(filenames.pesticide_exposed, labels, data.pesticide_unexposed, data.greaterValue)
        await this.generateGraph(filenames.pesticide_unexposed, labels, data.pesticide_exposed, data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_low, labels, data.risk_stratification_low, data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_intermediate, labels, data.risk_stratification_intermediate, data.greaterValue)
        await this.generateGraph(filenames.risk_stratification_high, labels, data.risk_stratification_high, data.greaterValue)
    }

    getSortedFilenames() {
        let files = fs.readdirSync(`${__dirname}/../public/tmp`)
        files = files.map(file => file.split('-')[0])
        const result = files.filter((value, index, self) => self.indexOf(value) === index).sort()
        return result
    }

    generateReport(query) {
        console.log(query)
        let pdfDoc = new PDFDoc
        const filePrefixes = this.getSortedFilenames()

        pdfDoc.pipe(fs.createWriteStream('Relatório.pdf'))
        pdfDoc.font('Courier-Bold').fontSize(25).fillColor('black').text('Relatório')
        pdfDoc.moveDown()

        for (let i in filePrefixes) {
            const files = {
                total_data: `${__dirname}/../public/tmp/${filePrefixes[i]}-total_data.png`,
                pesticide_exposed: `${__dirname}/../public/tmp/${filePrefixes[i]}-pesticide_exposed.png`,
                pesticide_unexposed: `${__dirname}/../public/tmp/${filePrefixes[i]}-pesticide_unexposed.png`,
                risk_stratification_low: `${__dirname}/../public/tmp/${filePrefixes[i]}-risk_stratification_low.png`,
                risk_stratification_intermediate: `${__dirname}/../public/tmp/${filePrefixes[i]}-risk_stratification_intermediate.png`,
                risk_stratification_high: `${__dirname}/../public/tmp/${filePrefixes[i]}-risk_stratification_high.png`
            }

            pdfDoc.font('Courier').fontSize(14).text('Todos os dados', { align: 'center' })
            pdfDoc.image(files.total_data, { fit: [470, 160], align: 'center' })
            pdfDoc.moveDown()
            pdfDoc.text('Exposto a pesticida', { align: 'center' })
            pdfDoc.image(files.pesticide_unexposed, { fit: [470, 160], align: 'center' })
            pdfDoc.moveDown()
            pdfDoc.text('Não exposto a pesticida', { align: 'center' })
            pdfDoc.image(files.pesticide_exposed, { fit: [470, 160], align: 'center' })
            pdfDoc.addPage()
            pdfDoc.text('Estratificação de risco: baixa', { align: 'center' })
            pdfDoc.image(files.risk_stratification_low, { fit: [470, 160], align: 'center' })
            pdfDoc.moveDown()
            pdfDoc.text('Estratificação de risco: intermediária', { align: 'center' })
            pdfDoc.image(files.risk_stratification_intermediate, { fit: [470, 160], align: 'center' })
            pdfDoc.moveDown()
            pdfDoc.text('Estratificação de risco: alta', { align: 'center' })
            pdfDoc.image(files.risk_stratification_high, { fit: [470, 160], align: 'center' })
            pdfDoc.moveDown()
            pdfDoc.text('-------------------------------------------------------', { align: 'center' })

            if (i != filePrefixes.length - 1) pdfDoc.addPage()
        }

        pdfDoc.end()
    }

}