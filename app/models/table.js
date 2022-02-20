module.exports = (sequelize, DataTypes) => {
    const Table = sequelize.define('Table', {
        name: DataTypes.STRING
    })

    Table.associate = function(models) {
        Table.hasMany(models.BCPatient, {
            foreignKey: 'table_id'
        })
    }

    return Table
}