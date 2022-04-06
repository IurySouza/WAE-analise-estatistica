const { Op } = require('sequelize')
const { sequelize } = require('../models/index')

const db = require('../models/index')
const User = db.User
const BCPatient = db.BCPatient
const Table = db.Table

module.exports = class BCP_Utils {

    getFilters = body => Object.entries(body).filter(val => val[1] != 'Selecione')
            .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {})

    async getLabels(attribute) {
        let labels = []
        switch (attribute) {
            case 'pesticide_exposure':
            case 'lymphnodal_metastasis':
            case 'menopause_at_diagnosis':
                labels.push('Não', 'Sim')
                break

            case 'estrogen_receptors':
            case 'progesterone_receptors':
            case 'her2':
                labels.push('Negativo', 'Positivo')
                break

            case 'molecular_subtype_tumor':
                labels.push('Luminal A', 'Luminal B', 'Luminal-HER', 'HER-2', 'Triplo negativo')
                break

            case 'risk_stratification':
                labels.push('Baixa', 'Intermediária', 'Alta')
                break

            case 'trophic_adipose_status':
                labels.push('Eutrófico', 'Acima do peso')
                break

            case 'ki67':
                labels.push('Menor ou igual a 14', 'Maior que 14')
                break

            case 'tumor_size':
                labels.push('Menor ou igual a 2cm', 'Maior ou igual a 2cm')
                break

            case 'histological_grade':
                labels.push('Grau 1 e 2', 'Grau 3')
                break

            case 'early_onset':
                labels.push('Abaixo dos 50 anos', 'A partir de 50 anos')
                break

            case 'age_diagnosis':
                labels.push('Até 40', 'Entre 40 e 50', 'Entre 50 e 60', 'Entre 60 e 70', 'Mais de 70')
                break

            case 'weight':
                labels = await this.getNumericalLabel('weight')
                break

            case 'height':
                labels = await this.getNumericalLabel('height')
                break

            case 'bmi':
                labels = await this.getNumericalLabel('bmi')
                break
        }

        return labels
    }

    async getNumericalLabel(param_name) {
        let labels = []

        const db_result = await BCPatient.findAll({
            attributes: [
                [sequelize.fn('min', sequelize.col(param_name)), 'minimum'],
                [sequelize.fn('max', sequelize.col(param_name)), 'maximum']
            ],
            raw: true
        })

        const min = param_name != 'height' ? db_result[0].minimum : db_result[0].minimum * 100
        const max = param_name != 'height' ? db_result[0].maximum : db_result[0].maximum * 100
        const diff = Math.floor(max - min)

        labels.push(
            `Entre ${Math.floor(min)} e ${Math.floor(min + (1 / 5) * diff)}`,
            `Entre ${Math.floor(min + (1 / 5) * diff)} e ${Math.floor(min + (2 / 5) * diff)}`,
            `Entre ${Math.floor(min + (2 / 5) * diff)} e ${Math.floor(min + (3 / 5) * diff)}`,
            `Entre ${Math.floor(min + (3 / 5) * diff)} e ${Math.floor(min + (4 / 5) * diff)}`,
            `Entre ${Math.floor(min + (4 / 5) * diff)} e ${Math.ceil(max)}`
        )

        return labels
    }

    async querySelector(attribute, p_conditions) {
        let data = {
            total_data: [],
            pesticide_unexposed: [],
            pesticide_exposed: [],
            risk_stratification_low: [],
            risk_stratification_intermediate: [],
            risk_stratification_high: []
        }

        const conditions = this.getConditions(p_conditions)

        switch (attribute) {
            case 'age_diagnosis':
            case 'weight':
            case 'height':
            case 'bmi':
                conditions.pesticide_exposure = false
                data.pesticide_unexposed = await this.getRangedData(attribute, conditions)
                conditions.pesticide_exposure = true
                data.pesticide_exposed = await this.getRangedData(attribute, conditions)
                delete conditions.pesticide_exposure

                conditions.risk_stratification = 'Low'
                data.risk_stratification_low = await this.getRangedData(attribute, conditions)
                conditions.risk_stratification = 'Intermediate'
                data.risk_stratification_intermediate = await this.getRangedData(attribute, conditions)
                conditions.risk_stratification = 'High'
                data.risk_stratification_high = await this.getRangedData(attribute, conditions)
                delete conditions.risk_stratification

                data.total_data = await this.getRangedData(attribute, conditions)
                break

            default:
                conditions.pesticide_exposure = false
                data.pesticide_unexposed = await this.getDefinedData(attribute, conditions)
                conditions.pesticide_exposure = true
                data.pesticide_exposed = await this.getDefinedData(attribute, conditions)
                delete conditions.pesticide_exposure

                conditions.risk_stratification = 'Low'
                data.risk_stratification_low = await this.getDefinedData(attribute, conditions)
                conditions.risk_stratification = 'Intermediate'
                data.risk_stratification_intermediate = await this.getDefinedData(attribute, conditions)
                conditions.risk_stratification = 'High'
                data.risk_stratification_high = await this.getDefinedData(attribute, conditions)
                delete conditions.risk_stratification

                data.total_data = await this.getDefinedData(attribute, conditions)

        }

        data.greaterValue = this.getGreaterValue(data.total_data)
        console.log(data)

        return data
    }

    async getDefinedData(attribute, conditions) {
        let data = []

        const aux = await BCPatient.findAll({
            attributes: [
                attribute,
                [sequelize.fn('COUNT', db.sequelize.col(attribute)), 'count']
            ],
            group: attribute,
            where: conditions,
            raw: true,
        })

        for (let i in aux) {
            if (aux[i][attribute] != null) {
                data.push(aux[i].count)
            }
        }

        if (data.length == 1 && conditions != undefined) {
            if (conditions[attribute] == false) data.push(0)
            else if (conditions[attribute] == true) data = [0, data[0]]
        }

        return data
    }

    async getRangedData(attribute, conditions) {
        const minMax = await BCPatient.findAll({
            attributes: [
                [sequelize.fn('min', sequelize.col(attribute)), 'minimum'],
                [sequelize.fn('max', sequelize.col(attribute)), 'maximum'],
            ],
            raw: true
        })

        let entries = await BCPatient.findAll({
            attributes: [attribute],
            where: conditions,
            raw: true
        })

        let data = [0, 0, 0, 0, 0]
        const ranges = []

        const min = attribute != 'height' ? minMax[0].minimum : minMax[0].minimum * 100
        const max = attribute != 'height' ? minMax[0].maximum : minMax[0].maximum * 100
        const diff = max - min

        if (attribute == 'height') entries = entries.map(e => { return { height: e.height * 100 } })

        for (let i = 1; i <= 5; i++) {
            ranges.push(min + (i / 5) * diff)
        }

        for (let i in entries) {
            if (entries[i][attribute] >= min && entries[i][attribute] < ranges[0])
                data[0]++
            else if (entries[i][attribute] >= ranges[0] && entries[i][attribute] < ranges[1])
                data[1]++
            else if (entries[i][attribute] >= ranges[1] && entries[i][attribute] < ranges[2])
                data[2]++
            else if (entries[i][attribute] >= ranges[2] && entries[i][attribute] < ranges[3])
                data[3]++
            else
                data[4]++
        }

        return data
    }

    getConditions(p_conditions) {
        let conditions = {}
        p_conditions = this.getFilters(p_conditions)

        for (let key in p_conditions) {
            if (key != 'id_u' && key != 'id_t' && key != 'show_data_for') {
                let value = p_conditions[key]
                if (value == 'on') value = true
                conditions[key] = value
            }
        }

        return conditions
    }

    getPropertyName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).split('_').join(' ')
    }

    getGreaterValue(arr) {
        let max = Math.max(...arr)

        if (max > 10) return max + (10 - max % 10)
        else return 10
    }

    getDataSum(data) {
        return {
            total_data: data.total_data.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0),
            pesticide_unexposed: data.pesticide_unexposed.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0),
            pesticide_exposed: data.pesticide_exposed.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0),
            risk_stratification_low: data.risk_stratification_low.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0),
            risk_stratification_intermediate: data.risk_stratification_intermediate.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0),
            risk_stratification_high: data.risk_stratification_high.map(e => parseInt(e)).reduce((partialSum, a) => partialSum + a, 0)
        }
    }

}

// TALVEZ POSSA SER ÚTIL:
// const query_attributes = ['pesticide_exposure', 'estrogen_receptors', 'her2', 'ki67', 'molecular_subtype_tumor',
//     'tumor_size', 'histological_grade', 'lymphnodal_metastasis', 'risk_stratification', 'age_diagnosis',
//     'early_onset', 'menopause_at_diagnosis', 'weight', 'height', 'bmi', 'trophic_adipose_status']

// const index = query_attributes.indexOf(attribute)
// query_attributes.splice(index, 1)