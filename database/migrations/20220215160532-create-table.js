module.exports = {
  async up(queryInterface, DataTypes) {
    return queryInterface.createTable('Tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },

      id_join: {
        allowNull: false,
        type: DataTypes.INTEGER
      },

      table_name: {
        allowNull: false,
        type: DataTypes.STRING
      },

      insertion_date: {
        allowNull: false,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    })
  },
  async down(queryInterface) {
    return queryInterface.dropTable('Tables')
  }
};
