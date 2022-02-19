'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    return queryInterface.createTable('Tables', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
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
    return queryInterface.dropTable('Tables')
  }
};
