module.exports = (sequelize, DataTypes) => {
    const BCPatient = sequelize.define('BCPatient', {
        register_number: DataTypes.INTEGER,
        pesticide_exposure: DataTypes.BOOLEAN,
        estrogen_receptors: DataTypes.BOOLEAN,
        progesterone_receptors: DataTypes.BOOLEAN,
        her2: DataTypes.BOOLEAN,
        ki67: DataTypes.BOOLEAN,
        molecular_subtype_tumor_id: DataTypes.INTEGER,
        molecular_subtype_tumor: DataTypes.STRING,
        tumor_size: DataTypes.BOOLEAN,
        histological_grade: DataTypes.BOOLEAN,
        lymphnodal_metastasis: DataTypes.BOOLEAN,
        risk_stratification: DataTypes.STRING,
        age_diagnosis: DataTypes.INTEGER,
        early_onset: DataTypes.BOOLEAN,
        menopause_at_diagnosis: DataTypes.BOOLEAN,
        weight: DataTypes.FLOAT,
        height: DataTypes.FLOAT,
        bmi: DataTypes.FLOAT,
        trophic_adipose_status: DataTypes.STRING
    })

    BCPatient.associate = function(models) {
        BCPatient.belongsTo(models.Table, {
            foreignKey: 'table_id'
        })
    }

    return BCPatient
}