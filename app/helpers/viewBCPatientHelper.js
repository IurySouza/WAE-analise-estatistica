const { Op } = require('sequelize')
const { sequelize } = require('../models/index')

const db = require('../models/index')
const User = db.User
const BCPatient = db.BCPatient
const Table = db.Table

module.exports = class BCP_Utils {

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
                labels.push('Eutrófico', 'Abaixo do peso', 'Acima do peso', 'Obesidade')
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

}