module.exports = (sequelize, DataTypes) => {
    const Table = sequelize.define('Table', {
        name: DataTypes.STRING
    })

    return Table
}