'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    return queryInterface.createTable('BCPatients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      table_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Tables',
            key: 'id'
          }
      },
      register_number: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      pesticide_exposure: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      estrogen_receptors: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      progesterone_receptors: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      her2: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      ki67: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      molecular_subtype_tumor_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      molecular_subtype_tumor: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tumor_size: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      histological_grade: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      lymphnodal_metastasis: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      risk_stratification: {
        allowNull: false,
        type: DataTypes.STRING
      },
      age_diagnosis: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      early_onset: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      menopause_at_diagnosis: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      weight: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      height: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      bmi: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      trophic_adipose_status: {
        allowNull: true,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('BCPatients')
  }
};
